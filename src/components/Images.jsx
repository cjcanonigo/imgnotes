import React, { Component } from "react";
import { Grid, Paper, IconButton, TextField } from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import CloudDownload from "@material-ui/icons/CloudDownload";

class Images extends Component {
  state = {
    imageData: [],
    currImg: 0,
    currImgHeight: 0,
    currImgWidth: 0
  };

  constructor(props) {
    super(props);
    // check the regex: https://regexr.com/
    // Check the require.context from webpack:
    //https://medium.com/@godban/loading-static-and-dynamic-images-with-webpack-8a933e82cb1e
    this.state.imgs = this.imgAll(
      require.context("./../imgs", false, /\.(jpe?g|png|svg)$/)
    );

    let imgData = this.state.imgs.map(imgLoc => {
      let locString = String(imgLoc).replace("/static/media/", "");
      let subString = locString
        .substring(0, locString.lastIndexOf("."))
        .replace(/\.(.*$)/, "");
      let extension = locString.substring(
        locString.lastIndexOf("."),
        locString.length
      );
      let imgName = subString + extension;
      return {
        imgLoc: imgLoc,
        imgName: imgName,
        note: ""
      };
    });

    this.state.imageData = imgData;
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

  convertArrayOfObjectsToCSV = args => {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || ",";
    lineDelimiter = args.lineDelimiter || "\n";
    keys = Object.keys(data[0]);
    console.log("keys: ", keys);
    if (args.keys !== null) {
      keys = args.keys;
    }
    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    // console.log(keys);

    data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  };
  handleDownload = args => {
    console.log("download clicked!");
    let data = this.state.imageData;

    let filename, link;
    var csv = this.convertArrayOfObjectsToCSV({
      data: this.state.imageData,
      keys: ["imgName", "note"]
    });
    if (csv == null) return;

    filename = args.filename || "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = "data:text/csv;charset=utf-8," + csv;
    }
    data = encodeURI(csv);

    link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", filename);
    link.click();
    console.log(this.state.imageData);
  };

  // handleDownload = () => {
  //   console.log("Download clicked!");
  //   this.downloadCSV();
  // };

  render() {
    return (
      <Grid container>
        <Grid item xs={3}>
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
        <Grid item xs={3} style={{ padding: 16 }}>
          <img
            onLoad={this.handleImgLoad}
            src={this.state.imageData[this.state.currImg].imgLoc}
          />
        </Grid>
      </Grid>
    );
  }
}

export default Images;
