import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Forms = lazy(() => import("../pages/Forms"));
const Cards = lazy(() => import("../pages/Cards"));
const Charts = lazy(() => import("../pages/Charts"));
const Buttons = lazy(() => import("../pages/Buttons"));
const Modals = lazy(() => import("../pages/Modals"));
const Tables = lazy(() => import("../pages/Tables"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
//////////////////////////Pages/////////////////////////////////
const Scheduler = lazy(() => import("../pages/Scheduler"));
const Nesting = lazy(() => import("../pages/Nesting"));
const Laser = lazy(() => import("../pages/Laser"));
const PressBrake = lazy(() => import("../pages/PressBrake"));
const TubeFab = lazy(() => import("../pages/TubeFab"));
const TubeBender = lazy(() => import("../pages/TubeBender"));
const Saw = lazy(() => import("../pages/Saw"));
const Mill = lazy(() => import("../pages/Mill"));
const Lathe = lazy(() => import("../pages/Lathe"));
const Welding = lazy(() => import("../pages/Welding"));
const RoboticWelding = lazy(() => import("../pages/RoboticWelding"));
const PowderCoating = lazy(() => import("../pages/PowderCoating"));
const Hardware = lazy(() => import("../pages/Hardware"));
const FinalAssembly = lazy(() => import("../pages/FinalAssembly"));
const Packaging = lazy(() => import("../pages/Packaging"));
const Shipping = lazy(() => import("../pages/Shipping"));
////////////////////////////////////////////////////////////////
/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/scheduler",
    component: Scheduler,
  },
  {
    path: "/nesting",
    component: Nesting,
  },
  {
    path: "/laser",
    component: Laser,
  },
  {
    path: "/pressbrake",
    component: PressBrake,
  },
  {
    path: "/tubefab",
    component: TubeFab,
  },
  {
    path: "/tubebender",
    component: TubeBender,
  },
  {
    path: "/saw",
    component: Saw,
  },
  {
    path: "/mill",
    component: Mill,
  },
  {
    path: "/lathe",
    component: Lathe,
  },
  {
    path: "/welding",
    component: Welding,
  },
  {
    path: "/roboticwelding",
    component: RoboticWelding,
  },
  {
    path: "/powdercoating",
    component: PowderCoating,
  },
  {
    path: "/Hardware",
    component: Hardware,
  },
  {
    path: "/finalassembly",
    component: FinalAssembly,
  },
  {
    path: "/packaging",
    component: Packaging,
  },
  {
    path: "/shipping",
    component: Shipping,
  },
  {
    path: "/cards",
    component: Cards,
  },
  {
    path: "/charts",
    component: Charts,
  },
  {
    path: "/buttons",
    component: Buttons,
  },
  {
    path: "/modals",
    component: Modals,
  },
  {
    path: "/tables",
    component: Tables,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
];

export default routes;
