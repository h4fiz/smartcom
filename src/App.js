import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import News from './App/Pages/News/News';
import Home from './App/Pages/Home/Home';
import NewsDetail from './App/Pages/NewsDetail/NewsDetail';
import ParkInformation from './App/Pages/ParkInformation/ParkInformation';
import ParkEnterprise from './App/Pages/ParkEnterprise/ParkEnterprise';
import CompanyPage from './App/Pages/CompanyPage/CompanyPage';
import ProductPage from './App/Pages/ProductPage/ProductPage';
import ServicePage from './App/Pages/ServicePage/ServicePage';
import CompanyProfilePage from './App/Pages/CompanyProfilePage/CompanyProfilePage';
import ProductDetailPage from './App/Pages/ProductDetailPage/ProductDetailPage';
import ServiceDetailPage from './App/Pages/ServiceDetailPage/ServiceDetailPage';
import ComingSoonPage from './App/Pages/ComingSoonPage/ComingSoonPage';
import PersonalInformation from './App/Pages/PersonalInformation/PersonalInformation';

import ProjectPage from './App/Pages/ProjectPage/ProjectPage';
import ProjectDetailPage from './App/Pages/ProjectDetailPage/ProjectDetailPage';
import TalentPage from './App/Pages/TalentPage/TalentPage';
import TalentDetailPage from './App/Pages/TalentDetailPage/TalentDetailPage';
import InvestmentPage from './App/Pages/InvestmentPage/InvestmentPage';
import InvestmentDetailPage from './App/Pages/InvestmentDetailPage/InvestmentDetailPage';

import MarketplacePage from './App/Pages/MarketplacePage/MarketplacePage';
import MerchantListPage from './App/Pages/MerchantListPage/MerchantListPage';
import MerchantProfilePage from './App/Pages/MerchantProfilePage/MerchantProfilePage';
import MerchantPayment from './App/Pages/MerchantPayment/MerchantPayment';
import Moments from './App/Pages/Moments/Moments';
import MomentsDetail from './App/Pages/MomentsDetail/MomentsDetail';
import OnlineStorePage from './App/Pages/OnlineStorePage/OnlineStorePage';

import CoorporateContactPage from './App/Pages/CoorporateContactPage/CoorporateContactPage';
import EntertainmentPage from './App/Pages/EntertainmentPage/EntertainmentPage';
import PaymentCenterPage from './App/Pages/PaymentCenterPage/PaymentCenterPage';
import PaymentCenterDetailPage from './App/Pages/PaymentCenterDetailPage/PaymentCenterDetailPage';
import VisitorAccessPage from './App/Pages/VisitorAccessPage/VisitorAccessPage';
import VisitorAccessDetailPage from './App/Pages/VisitorAccessDetailPage/VisitorAccessDetailPage';
import ServiceCenterPage from './App/Pages/ServiceCenterPage/ServiceCenterPage';
import ServiceCenterDetail from './App/Pages/ServiceCenterDetail';
import ServiceCenterConfirmation from './App/Pages/ServiceCenterConfirmation';
import ServiceCenterForm from './App/Pages/ServiceCenterForm/ServiceCenterForm';
import ServiceCenterCategorySelect from './App/Pages/ServiceCenterCategorySelect/ServiceCenterCategorySelect';

import SpaceBookings from './App/Pages/SpaceBookings/SpaceBookings';

import RoomReservationDetail from './App/Pages/RoomReservationDetail/RoomReservationDetail';
import RoomReservationForm from './App/Pages/RoomReservationForm/RoomReservationForm';
import RoomCategorySelect from './App/Pages/RoomCategorySelect/RoomCategorySelect';

import ActivityReservationDetail from './App/Pages/ActivityReservationDetail/ActivityReservationDetail';
import ActivityReservationForm from './App/Pages/ActivityReservationForm/ActivityReservationForm';
import ActivityCategorySelect from './App/Pages/ActivityCategorySelect/ActivityCategorySelect';

import DirectoryCategorySelect from './App/Pages/DirectoryCategorySelect/DirectoryCategorySelect';
import Directory from './App/Pages/Directory/Directory';
import DirectoryDetail from './App/Pages/DirectoryDetail/DirectoryDetail';

import TrafficCamera from './App/Pages/TrafficCamera';

import Login from './App/Pages/Login/Login';

import { library } from '@fortawesome/fontawesome-svg-core';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faUserCircle, faSearch, faTint,faLightbulb , faBusinessTime, faPhone, faTimesCircle, faTimes, faCircle, faPlus, faShoppingCart} from '@fortawesome/free-solid-svg-icons';

library.add(faChevronLeft, faUserCircle, faSearch, faTint, faLightbulb, faBusinessTime, faPhone, faTimesCircle, faTimes, faCircle, faPlus, faShoppingCart);


class App extends Component {
  render() {
    return (
      <div >
        <Route exact path="/" component={Home} />
        <Route path="/comingsoon" component={ComingSoonPage} />
        <Route path="/news" component={News} />
        <Route path="/newsdetail/:idnews" component={NewsDetail} />
        <Route path="/parkinformation" component={ParkInformation} />
        <Route path="/parkenterprise/:communityid" component={ParkEnterprise} />
        <Route path="/company" component={CompanyPage} />
        <Route path="/product/:companyid" component={ProductPage} />
        <Route path="/service/:companyid" component={ServicePage} />
        <Route path="/companyprofile/:companyid" component={CompanyProfilePage} />
        <Route path="/productdetail/:productid" component={ProductDetailPage} />
        <Route path="/servicedetail/:serviceid" component={ServiceDetailPage} />
        <Route path="/project/:companyid" component={ProjectPage} />
        <Route path="/projectdetail/:projectid" component={ProjectDetailPage} />
        <Route path="/talent/:companyid" component={TalentPage} />
        <Route path="/talentdetail/:talentid" component={TalentDetailPage} />
        <Route path="/investment/:companyid" component={InvestmentPage} />
        <Route path="/investmentdetail/:investmentid" component={InvestmentDetailPage} />
        <Route path="/marketplace" component={MarketplacePage} />
        <Route path="/merchantlist/:communityid/:categoryid" component={MerchantListPage} />
        <Route path="/merchantprofile/:merchantid" component={MerchantProfilePage} />
		<Route path="/merchantpayment/:merchantid" component={MerchantPayment} />
        <Route path="/moments" component={Moments} />
			  <Route path="/momentsdetail/:momentid" component={MomentsDetail} />
        <Route path="/coorporatecontact/:communityid" component={CoorporateContactPage} />
	      <Route path="/personalinformation" component={PersonalInformation} />
        <Route path="/entertainment" component={EntertainmentPage} />
	      <Route path="/onlinestore/:communityid" component={OnlineStorePage} />
        <Route path="/paymentcenter" component={PaymentCenterPage} />
	      <Route path="/paymentcenterdetail/:paymentid" component={PaymentCenterDetailPage} />
		<Route path="/visitoraccess" component={VisitorAccessPage} />
	      <Route path="/visitoraccessdetail/:uservisitid" component={VisitorAccessDetailPage} />
        <Route path="/servicecenter" component={ServiceCenterPage} />
        <Route path="/servicecenterdetail/:userserviceid" component={ServiceCenterDetail} />
        <Route path="/servicecenterconfirmation/:userserviceid" component={ServiceCenterConfirmation} />
        <Route path="/servicecenterform/:servicecentercategoryid" component={ServiceCenterForm} />
		<Route path="/servicecentercategoryselect" component={ServiceCenterCategorySelect} />
		<Route path="/spacebookings" component={SpaceBookings} />
        <Route path="/roomreservationdetail/:roomreservationid" component={RoomReservationDetail} />
        <Route path="/roomreservationform/:roomcategoryid" component={RoomReservationForm} />
		    <Route path="/roomcategoryselect" component={RoomCategorySelect} />
		<Route path="/activityreservationdetail/:activityreservationid" component={ActivityReservationDetail} />
        <Route path="/activityreservationform/:activitycategoryid" component={ActivityReservationForm} />
		    <Route path="/activitycategoryselect" component={ActivityCategorySelect} />
		<Route path="/directorycategoryselect" component={DirectoryCategorySelect} />
		<Route path="/directory/:directorycategoryid" component={Directory} />
			<Route path="/directorydetail/:directoryid" component={DirectoryDetail} />
        <Route path="/trafficcamera" component={TrafficCamera} />
		<Route path="/login" component={Login} />
      </div>
    );
  }
}

export default App;
