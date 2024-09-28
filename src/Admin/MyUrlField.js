import React from "react";
import { makeStyles } from '@mui/styles';
import LaunchIcon from '@mui/icons-material/Launch';
const useStyles = makeStyles({
  link: {
    textDecoration: "none"
  },
  icon: {
    width: "0.5em",
    paddingLeft: 2
  }
});

const MyUrlField = ({ record = {}, source }) => {
  const classes = useStyles();
  return (
    <a href={record[source]} className={classes.link}>
      {record[source]}
      <LaunchIcon className={classes.icon} />
    </a>
  );
};

export default MyUrlField;
