import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import axios from 'axios';
import API_PATHS from 'constants/apiPaths';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();
  const userName = localStorage.getItem('user');
  const userPass = localStorage.getItem('pass');
  if (userName && userPass) {
    const token = btoa(`${userName}:${userPass}`);
    localStorage.setItem('authorization_token', token);
  }

  const onFileChange = (e: any) => {
    console.log(e.target.files[0].name);
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    setFile(files.item(0));
  };

  const removeFile = () => {
    setFile('');
  };

  const uploadFile = async (e: any) => {
    console.log(e.target);
    const authorizationToken = localStorage.getItem('authorization_token');
    // Get the presigned URL
    const response = await axios({
      method: 'GET',
      url: `${API_PATHS.import}`,
      headers: {
        'Authorization': `Basic ${authorizationToken}`
      },
      params: {
        name: encodeURIComponent(file.name)
      }
    })

    console.log('File to upload: ', file.name)
    console.log('Uploading to: ', response.data)
    const result = await fetch(response.data, {
      method: 'PUT',
      headers: {
        'Content-type': 'text/csv'
      },
      body: file
    })
    console.log('Result: ', result)
    setFile('');
  };

  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </div>
  );
}
