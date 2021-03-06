import { Button, Form, Input } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ADD_COMMENT_REQUEST } from "../reducers/post";
import PropTypes from 'prop-types';

const CommentForm = ({ post }) => {
  const [commentText, setCommentText] = useState('');
  const { commentAdded, isLoadingComment } = useSelector(state => state.post);
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const onSubmitComment = useCallback((e) => {
    e.preventDefault();

    if (!me) {
      return alert('로그인이 필요합니다.');
    }

    return dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      },
    });
  }, [me && me.id, commentText]);

  useEffect(() => {
    setCommentText('');
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  return (
    <Form onSubmit={onSubmitComment}>
      <Form.Item>
        <Input.TextArea row={4} value={commentText} onChange={onChangeCommentText} />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoadingComment}>삐약</Button>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
