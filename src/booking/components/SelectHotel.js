import React, {
  lazy,
  Suspense,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import axios from 'axios';
import { Grid, Loader, Container } from 'semantic-ui-react';

import Filters from './Filters';
import SortBar from './SortBar';
import HotelsList from './HotelsList';
import ChartSwitcher from './ChartSwitcher';
import { ONLINE_URL, BEDS_TYPE } from '../../utils/const';
import lazyWithPreload from '../../utils/lazyWithPreload';

// lazy loading: when we don't know if user will click on chart
// maybe it's not necessary at all?
// const RatingChart = lazy(() => import('./RatingChart'));

// Preloaded chart version: if we are sure user will click on chart
const RatingChart = lazyWithPreload(() => import('./RatingChart'));

const SelectHotel = props => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState('price');
  const [chartVisible, setChartVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await axios(ONLINE_URL);
      setHotels(result.data.list.slice(0, 20));
      setLoading(false);
      RatingChart.preload();
    };
    fetchData();
  }, []);

  const setBedtypeFilter = useCallback(
    (value, checked) => {
      const newFilters = {
        ...filters,
        [value]: checked,
      };
      setFilters(newFilters);
    },
    [filters]
  );

  const filteredHotels = useMemo(() => applyFilter(filters, hotels), [
    filters,
    hotels,
  ]);

  const sortedHotels = useMemo(() => applySort(filteredHotels, sortField), [
    filteredHotels,
    sortField,
  ]);

  const countedHotels = useMemo(() => countHotelsByBedType(hotels), [hotels]);

  const chartData = useMemo(() => prepareChartData(filteredHotels), [
    filteredHotels,
  ]);

  return (
    <Container>
      <SortBar sortField={sortField} setField={value => setSortField(value)} />
      <Layout>
        <Layout.Sidebar>
          <ChartSwitcher
            isChartVisible={chartVisible}
            switchChartVisible={setChartVisible}
          />
          <Filters count={countedHotels} onChange={setBedtypeFilter} />
        </Layout.Sidebar>
        <Layout.Feed isLoading={loading}>
          {chartVisible && (
            <Suspense fallback={<div>Loading...</div>}>
              <RatingChart data={chartData} />
            </Suspense>
          )}
          {loading ? (
            <Loader active inline="centered" />
          ) : (
            <HotelsList hotels={sortedHotels} selectHotel={props.selectHotel} />
          )}
        </Layout.Feed>
      </Layout>
    </Container>
  );
};

const noop = () => {};

function countHotelsByBedType(data) {
  return data.reduce(function(acc, v) {
    acc[v.room] = acc[v.room] ? acc[v.room] + 1 : 1;
    return acc;
  }, {});
}

function applyFilter(filters, data) {
  const isFilterSet = BEDS_TYPE.find(b => filters[b.value]);
  if (!isFilterSet) {
    return data;
  }
  const filtered = data.filter(h => filters[h.room]);
  return filtered;
}

function prepareChartData(hotels) {
  return hotels.map(h => ({
    rating: +h.rating.average,
    price: +h.price.amount,
    reviews: +h.rating.reviews,
    name: h.title,
  }));
}

const sortHotels = {
  price: (a, b) => a.price.amount - b.price.amount,
  rating: (a, b) => b.rating.average - a.rating.average,
  reviews: (a, b) => b.rating.reviews - a.rating.reviews,
};

function applySort(hotels, sortField) {
  return hotels.sort(sortHotels[sortField]).concat([]);
}

const Layout = ({ children }) => (
  <Grid stackable divided>
    <Grid.Row>{children}</Grid.Row>
  </Grid>
);

const Sidebar = ({ children }) => (
  <Grid.Column width={4}>{children}</Grid.Column>
);

const Feed = ({ children }) => <Grid.Column width={12}>{children}</Grid.Column>;

Layout.Sidebar = Sidebar;
Layout.Feed = Feed;

export default SelectHotel;
