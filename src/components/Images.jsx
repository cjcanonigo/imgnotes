import React, { Component } from "react";
import { Grid, Paper, IconButton, TextField } from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import CloudDownload from "@material-ui/icons/CloudDownload";
import Papa from "papaparse";

class Images extends Component {
  state = {
    imageData: [],
    imageLocData: [],
    currImg: 0,
    currImgHeight: 0,
    currImgWidth: 0
  };

  constructor(props) {
    super(props);
    // check the regex: https://regexr.com/
    // Check the require.context from webpack:
    //https://medium.com/@godban/loading-static-and-dynamic-images-with-webpack-8a933e82cb1e
    let imgs = this.imgAll(
      require.context("./../../public/imgs", false, /\.(jpe?g|png|svg)$/)
    );

    let imageLocData = [];
    let imageData = [];
    for (let i = 0; i < imgs.length; i++) {
      let splitStr = String(imgs[i])
        .replace("/static/media/", "")
        .split(".");
      imageLocData.push(imgs[i]);
      imageData.push({
        imgName: splitStr[0] + "." + splitStr[2],
        note: ""
      });
    }

    this.state.imageData = imageData;
    this.state.imageLocData = imageLocData;
  }

  imgAll = r => {
    return r.keys().map(r);
  };

  handleNotes = change => {
    let newNote = change.target.value;
    let newArr = this.state.imageData;
    newArr[this.state.currImg].note = newNote;
    this.setState({ imageData: newArr });
    console.log(this.state.imageData);
  };

  handlePrevButton = () => {
    const arrLen = this.state.imageData.length;
    let prevImg = this.state.currImg - 1;
    if (prevImg < 0) {
      prevImg = arrLen - 1;
    }
    this.setState({ currImg: prevImg });
  };

  handleNextButton = () => {
    const arrLen = this.state.imageData.length;
    let nextImg = this.state.currImg + 1;
    if (nextImg >= arrLen) {
      nextImg = 0;
    }
    this.setState({ currImg: nextImg });
  };

  handleImgLoad = () => {
    let img = document.images[1]; //The first image is the icon, 2nd is the ad to approve
    this.setState({
      currImgHeight: img.naturalHeight,
      currImgWidth: img.naturalWidth
    });
  };

  handleDownload = () => {
    let csv = Papa.unparse(this.state.imageData);
    let link = document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURI(csv));
    link.setAttribute("download", "export.csv");
    link.click();
  };

  render() {
    return (
      <Grid container>
        <Grid item xs={6} md={5}>
          <Paper style={{ padding: 16, margin: 16 }}>
            <IconButton color="primary" onClick={this.handlePrevButton}>
              <ChevronLeft />
            </IconButton>
            <span> {this.state.currImg} </span>
            <IconButton color="primary" onClick={this.handleNextButton}>
              <ChevronRight />
            </IconButton>
            <br />
            <span>
              {this.state.currImgWidth} x {this.state.currImgHeight}
            </span>
            <br />
            <CloudDownload color="primary" onClick={this.handleDownload} />
            <br />
            <TextField
              label="Note"
              multiline
              rowsMax="4"
              value={this.state.imageData[this.state.currImg].note}
              onChange={this.handleNotes}
            />
          </Paper>
        </Grid>
        <Grid item xs={6} md={7} style={{ padding: 16 }}>
          <img
            onLoad={this.handleImgLoad}
            src={this.state.imageLocData[this.state.currImg]}
          />
        </Grid>
      </Grid>
    );
  }
}

export default Images;
