import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostForm from './PostForm';
import Spiner from '../common/Spiner';
import { getPosts } from '../../actions/postActions';
import PostFeed from './PostFeed';

class Posts extends Component {

    componentDidMount = () => {
        this.props.getPosts();
    }


    render() {

        const { posts, loading } = this.props.post;
        let postContent;
        if (posts === null || loading === true) {
            postContent = <Spiner />
        } else {
            postContent = <PostFeed posts={posts} />
        }


        return (
            <div className='feed'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <PostForm />
                            {postContent}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}


Posts.propTypes = {
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post,
    getPosts: PropTypes.func.isRequired
})

export default connect(mapStateToProps, { getPosts })(Posts);