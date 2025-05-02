import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import DefaultLayout from './layout/DefaultLayout';
import GuestLayout from "./layout/GuestLayout";

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

// import Dashboard from "./content/Dashboard";
// import Home from "./content/Home";
// import Baptismal from "./content/request/Baptismal";
// import Client from "./content/setup/Client";
// import Collection from "./content/collections/Collection";
// import Login from "./layout/Login";
// import ManageBaptism from "./content/management/ManageBaptism";
// import ManageWFB from "./content/management/ManageWFB";
// import Parish from "./content/setup/Parish";
// import Priest from "./content/setup/Priest";
// import Receivables from "./content/collections/Receivables";
// import Register from "./layout/Register";
// import Test from "./Test";
// import TestDocument from "./TestDocument";
// import TestPrintPDF from "./TestPrintPDF";
// import Users from "./content/User";
// import UserSetup from "./layout/UserSetup";
// import WFB from "./content/request/WFB";

const Home = lazy(() => import('./content/Home'));
const Dashboard = lazy(() => import('./content/Dashboard'));
const Baptismal = lazy(() => import("./content/request/Baptismal"));
const Client = lazy(() => import("./content/setup/Client"));
const Collection = lazy(() => import("./content/collections/Collection"));
const Login = lazy(() => import("./layout/Login"));
const ManageBaptism = lazy(() => import("./content/management/ManageBaptism"));
const ManageWFB = lazy(() => import("./content/management/ManageWFB"));
const Parish = lazy(() => import("./content/setup/Parish"));
const Priest = lazy(() => import("./content/setup/Priest"));
const Receivables = lazy(() => import("./content/collections/Receivables"));
const Register = lazy(() => import("./layout/Register"));
const Test = lazy(() => import("./Test"));
const TestDocument = lazy(() => import("./TestDocument"));
const TestPrintPDF = lazy(() => import("./TestPrintPDF"));
const Users = lazy(() => import("./content/User"));
const UserSetup = lazy(() => import("./layout/UserSetup"));
const WFB = lazy(() => import("./content/request/WFB"));

const router =  createBrowserRouter([
    
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Home />
                    </Suspense>
                )
            },
            {
                path: 'home',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Home />
                    </Suspense>
                )
            },
            {
                path: '/dashboard',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Dashboard/>
                    </Suspense>
                )
            },
            {
                path: '/user',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Users/>
                    </Suspense>
                )
            },
            {
                path: '/user-setup',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <UserSetup/>
                    </Suspense>
                )
            },
            {
                path: '/client',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Client/>
                    </Suspense>
                )
            },
            {
                path: '/parish',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Parish/>
                    </Suspense>
                )
            },
            {
                path: '/priest',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Priest/>
                    </Suspense>
                )
            },
            {
                path: '/baptismal-request',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Baptismal/>
                    </Suspense>
                )
            },
            {
                path: '/wfb-request',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <WFB/>
                    </Suspense>
                )
            },
            {
                path: '/manage-baptism',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <ManageBaptism/>
                    </Suspense>
                )
            },
            {
                path: '/manage-wfb',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <ManageWFB/>
                    </Suspense>
                )
            },
            {
                path: '/receivables',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Receivables/>
                    </Suspense>
                )
            },
            {
                path: '/collection',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Collection/>
                    </Suspense>
                )
            },
            {
                path: '/test',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Test/>
                    </Suspense>
                )
            },
            {
                path: '/test2',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <TestPrintPDF/>
                    </Suspense>
                )
            },
            {
                path: '/test3',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <TestDocument/>
                    </Suspense>
                )
            },
        ]
    },{
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/login',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Login/>
                    </Suspense>
                )
            },
            {
                path: '/register',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                    <Register/>
                    </Suspense>
                )
            }
        ]
    },
],{
    basename: '/residents'
  });

export default router;