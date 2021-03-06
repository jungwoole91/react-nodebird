import Error from 'next/error';
import React from 'react';
import PropTypes from 'prop-types';

const MyError = ({statusCode}) => {
  return (
    <div>
      <h1>{statusCode} 에러 발생</h1>
      <Error statusCode={statusCode} />
    </div>
  );
};

MyError.propTypes = {
  statusCode: PropTypes.number,
};

// 에러가 아니면 기본코드 400을 넣는다.
MyError.defaultProps = {
  statusCode: 400,
};

MyError.getInitialProps = async (context) => {
  // 서버면 context.res가 존재한다.
  const statusCode = context.res ? context.res.statusCode : context.err ? context.err.statusCode : null;
  return { statusCode };
};

export default MyError;
