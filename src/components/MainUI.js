import { Container, TextField, Box, Grid, IconButton } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import FolderIcon from "@mui/icons-material/Folder";
const MainUI = () => {
  return (
    <Container>
      <Box component="form" noValidate autoComplete="off" sx={{ m: "10px" }}>
        <Grid
          container
          fullWidth
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <IconButton>
              <FileOpenIcon></FileOpenIcon>
            </IconButton>
          </Grid>
          <Grid item>
            <TextField
              id="source-file"
              label="Source File"
              variant="standard"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item>
            <IconButton>
              <FolderIcon></FolderIcon>
            </IconButton>
          </Grid>
          <Grid item>
            <TextField
              id="target-directory"
              label="Target Directory"
              variant="standard"
              fullWidth
              margin="dense"
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MainUI;
