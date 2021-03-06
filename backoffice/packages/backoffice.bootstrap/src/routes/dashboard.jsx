import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import TableList from "views/TableList/TableList.jsx";
import Typography from "views/Typography/Typography.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";

import EmptyHomePage from "views/Dashboard/EmptyHome.jsx"
import UsersHomePage from "views/Dashboard/Users.jsx"

import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  BubbleChart,
  LocationOn,
  Notifications
} from "@material-ui/icons";

const dashboardRoutes = [
  
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Material Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },/*
  {
    path: "/user",
    sidebarName: "User Profile",
    navbarName: "Profile",
    icon: Person,
    component: UserProfile
  },
  {
    path: "/table",
    sidebarName: "Table List",
    navbarName: "Table List",
    icon: ContentPaste,
    component: TableList
  },
  {
    path: "/typography",
    sidebarName: "Typography",
    navbarName: "Typography",
    icon: LibraryBooks,
    component: Typography
  },
  {
    path: "/icons",
    sidebarName: "Icons",
    navbarName: "Icons",
    icon: BubbleChart,
    component: Icons
  },
  {
    path: "/maps",
    sidebarName: "Maps",
    navbarName: "Map",
    icon: LocationOn,
    component: Maps
  },
  {
    path: "/notifications",
    sidebarName: "Notifications",
    navbarName: "Notifications",
    icon: Notifications,
    component: NotificationsPage
  },*/
  {
    path: "/welcome",
    sidebarName: "Welcome",
    navbarName: "Welcome",
    icon: Notifications,
    component: EmptyHomePage
  },
  {
    path: "/todolists",
    sidebarName: "TodoList Management",
    navbarName: "TodosList Management",
    icon: LibraryBooks,
    component: EmptyHomePage
  },
  {
    path: "/users",
    sidebarName: "User Management",
    navbarName: "User Management",
    icon: Person,
    component: UsersHomePage
  },
  
  { redirect: true, path: "/", to: "/welcome", navbarName: "Redirect" }
];

export default dashboardRoutes;
