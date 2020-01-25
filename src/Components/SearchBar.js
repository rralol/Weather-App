import React from "react";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        borderRadius: '25px',
        alignItems: 'center',
    },
    input: {
        paddingLeft: '20px',
        flex: '1',
    },

}));

export default function SearchBar(props) {
    const classes = useStyles();
    const {handleSubmit, handleInput} = props
  return (
    <form onSubmit = {e => handleSubmit(e)}>
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Input City..."
          onChange={e => handleInput(e.target.value)}
          required
        ></InputBase>
        <FormControl>
          <IconButton type="submit" >
            <SearchIcon />
          </IconButton>
        </FormControl>
      </Paper>
    </form>
  );
}
