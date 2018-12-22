import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfileCreds from './ProfileCreds';
import ProfileGithub from './ProfileGithub';
import Spiner from '../common/Spiner';
import { getProfileByHandle } from '../../actions/profileActions';


class Profile extends Component {


    componentDidMount = () => {
        if (this.props.match.params.handle) {
            this.props.getProfileByHandle(this.props.match.params.handle);
        }
    }


    render() {
        const { profile, loading } = this.props.profile;
        let profileContent;

        if (profile === null || loading) {
            profileContent = <Spiner />
        } else {
            profileContent = (

                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <Link to="/profiles" className="btn btn-info mb-3 float-left">
                                Go Back To Profiles
              </Link>
                        </div>
                        <div className="col-md-6" />
                    </div>
                    <div className='col-md-6'>

                    </div>
                    <ProfileHeader profile={profile} />
                    <ProfileAbout profile={profile} />
                    <ProfileCreds />
                    <ProfileGithub />
                </div>
            )
        }

        return (
            <div className='profile'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            {profileContent}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Profile.propTypes = {
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    getProfileByHandle: PropTypes.func.isRequired
})


export default connect(mapStateToProps, { getProfileByHandle })(Profile);