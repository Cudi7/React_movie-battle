import { createSelector, createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../../api/api';

//REDUCER******************************************************************************************

const initialMoviesSlice = createSlice({
  name: 'movies',
  initialState: {
    list: [],
    listDetails: {},
    loading: false,
  },
  reducers: {
    moviesRequested: (state, action) => {
      state.loading = true;
    },
    moviesReceived: (state, action) => {
      state.loading = false;

      state.list = action.payload.map((el) => {
        if (el.liked === true || false) {
          return { ...el };
        } else {
          return { ...el, liked: false };
        }
      });
    },

    movieDetailsReceived: (state, action) => {
      state.loading = false;
      state.listDetails = action.payload;
    },
    moviesFailed: (state, action) => {
      state.loading = false;
    },
    movieAdded: (state, action) => {
      const { movie } = action.payload;
      state.list.pop();
      state.list.unshift(movie);
    },
    movieDeleted: (state, action) => {
      state.list = state.list.filter(
        (movie) => movie.imdbID !== action.payload.id
      );
    },
    movieToggledLike: (state, action) => {
      state.list = state.list.map((movie) =>
        movie.imdbID === action.payload.id
          ? { ...movie, liked: !movie.liked }
          : { ...movie }
      );
    },
  },
});

export default initialMoviesSlice.reducer;
const {
  moviesRequested,
  moviesReceived,
  moviesFailed,
  movieAdded,
  movieDeleted,
  movieToggledLike,
  movieDetailsReceived,
} = initialMoviesSlice.actions;

//ACTION CREATORS******************************************************************************************

export const fetchInitialMovies = (data) => async (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      onStart: moviesRequested.type,
      onSuccess: moviesReceived.type,
      onError: moviesFailed.type,
      data: data ? data : null,
    })
  );
};

export const fetchMovieDetails = (id) => async (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      onStart: moviesRequested.type,
      onSuccess: movieDetailsReceived.type,
      onError: moviesFailed.type,
      id,
    })
  );
};

export const addMovie = (movie) => (dispatch, getState) => {
  dispatch(movieAdded({ movie }));
};

export const deleteMovie = (id) => (dispatch, getState) => {
  dispatch(movieDeleted({ id }));
};

export const toggleLike = (id) => (dispatch, getState) => {
  dispatch(movieToggledLike({ id }));
};

//SELECTORS******************************************************************************************

export const selectMovies = (state) =>
  createSelector(
    (state) => state.ui.movies.list,
    (list) => list
  );

export const selectLoading = (state) =>
  createSelector(
    (state) => state.ui.movies.loading,
    (loading) => loading
  );

export const selectMovieDetails = (state) =>
  createSelector(
    (state) => state.ui.movies.listDetails,
    (listDetails) => listDetails
  );
