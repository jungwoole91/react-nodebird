import React from 'react';
import Head from "next/dist/next-server/lib/head";
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import AppLayout from "../components/AppLayout";
import reducer  from '../reducers';
import rootSaga from '../sagas';


// import {initialState} from "../reducers/post";

// Component는 next에서 넣어주는 props이다.
// 현재 소스코드에서 index, profile, signup등의 컴포넌트들에 대한 정보를 가지고 있다.
const NodeBird = ({Component, store}) => {
  return (
    <Provider store={store}>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.6.3/antd.min.css"/>
      </Head>
      <AppLayout>
        <Component/>
      </AppLayout>
    </Provider>
  )
};

NodeBird.propTypes = {
  Component: PropTypes.elementType, // JSX로 들어갈수 있는 모든 것들 (문자, JSX, 숫자, 객체 등)
  store : PropTypes.object,
};

// nodeBird 컴포넌트에 props로 store를 넣어주는 역활을 함.
// state와 reducer가 합쳐져 있는게 store라고 생각하면 편하다.
const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware]; // middleware는 redux에 없는 기능들을 추가 할때 주로 사용된다.

  /**
   * enhancer
   * enhancer는 middleware를 강화한다는 의미이다.
   * applyMiddleware를 통해 middleware들을 적용한 뒤,
   * compose를 통해 middleware들을 합성할 수 있다.
   *
   * windwo.REDUX_DEVTOOLS_EXTENSION_CONPOSE
   * window.REDUX_DEVTOOLS... 이하 아래부분은 REDUX DEV 공식사이트에서 가져온 내용으로, devtools를 다운받으면 __REDUX_DEVTOOLS_EXTENTION__함수가 생긴다.
   * 이 함수를 사용하여 middleware를 생성하고 합성하는 코드이다.
   * typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : (f) => f,
   *
   * 추가적으로 production일때는 redux의 state가 노출되면 안되므로, production일때 redux devtools에 대한 접근을 막아준다.
   */

  const enhancer = process.env.NODE_ENV === 'production' ?
    compose(applyMiddleware(...middlewares))
    :
    compose(applyMiddleware(...middlewares),
      !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : (f) => f,
    )
  ;

  const store = createStore(reducer, initialState, enhancer); // 루트 reducer를 넣어준다.
  sagaMiddleware.run(rootSaga);

  return store;
};

// NodeBird 컴포넌트의 props로 store를 연결해주는 역활을 한다.
export default withRedux(configureStore)(NodeBird);
