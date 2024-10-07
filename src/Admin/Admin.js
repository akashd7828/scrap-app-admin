import React from "react";
import { Admin, Resource } from "react-admin";
import { UserList } from "./users";
import ScrapCards from "./ScrapCard";
import UserCards from "./UserCard";
import CreateScrapType from "./CreateScrapType";
import jsonServerProvider from "ra-data-json-server";

import PostIcon from "@mui/icons-material/Book";

import UserIcon from "@mui/icons-material/Group";
import CreateIcon from "@mui/icons-material/Create";
import Dashboard from "./Dashboard";
import authProvider from "./authProvider";
import LoginForm from "./LoginForm";
import OurBlogs from "./OurBlogs";
import LeadingBrands from "./LeadingBrands";
import Awards from "./Awards";
import Testimonials from "./Testimonials";
const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const MainAdmin = () => (
  <Admin
    dashboard={Dashboard}
    authProvider={authProvider}
    dataProvider={dataProvider}
    // loginPage={LoginForm}
  >
    <Resource name="scraps" list={ScrapCards} icon={PostIcon} />
    <Resource name="users" list={UserCards} icon={UserIcon} />
    <Resource
      name="scrap-types"
      list={CreateScrapType} // Ensure you have a list component
      create={CreateScrapType}
      icon={CreateIcon} // Set the icon here
    />
    <Resource name="awards" list={Awards} icon={PostIcon} />
    <Resource name="blogs" list={OurBlogs} icon={PostIcon} />
    <Resource name="leading-brands" list={LeadingBrands} icon={PostIcon} />
    <Resource name="testimonials" list={Testimonials} icon={UserIcon} />
  </Admin>
);

export default MainAdmin;
