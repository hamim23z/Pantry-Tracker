"use client";
import "../globals.css";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { firestore } from "../firebase";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Modal,
  Collapse,
  Link,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  getDoc,
  setDoc,
} from "firebase/firestore";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import WebIcon from "@mui/icons-material/Web";
import createStore from "react-auth-kit/createStore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [collapse, setCollapse] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItems = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItems = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // THE CODE BELOW IS FOR THE MENU, WHEN I CLICK THE THREE THINGS //
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // THIS CODE BELOW IS FOR THE RECIPE DROPDOWN, WHEN I CLICK RECIPE 1, 2, 3
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setCollapse((prev) => !prev);
  };

  const drawerList = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      sx={{
        backgroundColor: "#4F5D75",
        height: "100%",
        color: "white",
        paddingRight: "1px",
      }}
    >
      <List>
        {/*THIS IS FOR GITHUB, BOTH ICON AND NAME*/}
        <ListItem
          button
          component="a"
          href="https://github.com/hamim23z"
          target="_blank"
        >
          <ListItemIcon>
            <GitHubIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            primary="Cookbook"
            sx={{
              paddingRight: "40px",
              fontFamily: "Kanit, sans-serif",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          />
        </ListItem>

        {/*THIS IS FOR LINKEDIN, BOTH ICON AND NAME*/}
        <ListItem
          button
          component="a"
          href="https://www.linkedin.com/in/hamimc/"
          target="_blank"
        >
          <ListItemIcon>
            <LinkedInIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            primary="Pans"
            sx={{
              paddingRight: "40px",
              fontFamily: "Kanit, sans-serif",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          />
        </ListItem>

        {/*THIS IS FOR MY RESUME, BOTH ICON AND NAME*/}
        <ListItem
          button
          component="a"
          href="https://drive.google.com/file/d/1P4QjyfLhPeZPWTD9hku9ulFeinsEIYmz/view?usp=sharing"
          target="_blank"
        >
          <ListItemIcon>
            <InsertDriveFileIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            primary="Whisks"
            sx={{
              paddingRight: "40px",
              fontFamily: "Kanit, sans-serif",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          />
        </ListItem>

        {/*THIS IS FOR MY PORTFOLIO, BOTH ICON AND NAME*/}
        <ListItem
          button
          component="a"
          href="https://hamim23z.github.io/PersonalPortfolio_v1/"
          target="_blank"
        >
          <ListItemIcon>
            <WebIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            primary="Dishes"
            sx={{
              paddingRight: "40px",
              fontFamily: "Kanit, sans-serif",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#2D3142",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#4F5D75" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Kanit, sans-serif",
              fontWeight: "bold",
              flexGrow: 1,
            }}
          >
            PantryPalPlus
          </Typography>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            BackdropProps={{ invisible: true }}
            sx={{
              "& .MuiDrawer-paper": {
                backgroundColor: "#3F51B5",
                color: "white",
              },
            }}
          >
            {drawerList()}
          </Drawer>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: 0,
          flex: 1,
          gap: 2,
        }}
      >
        <Paper
          sx={{
            width: "50%",
            backgroundColor: "#4F5D75",
            color: "white",
            paddingTop: "400px",
            marginTop: "20px",
            padding: 2,
            height: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Kanit, sans-serif",
              fontWeight: "bold",
              mb: 2,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            Cookbook
          </Typography>
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/*RECIPE ONE CODE BELOW*/}
            <ListItem
              button
              onClick={() => handleRecipeClick("Recipe 1")}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ListItemText
                primary="Hashbrowns"
                sx={{
                  textTransform: "uppercase",
                  fontFamily: "Kanit, sans-serif",
                  fontWeight: "bold",
                  textAlign: "left",
                  width: "100%",
                }}
              />
              <Collapse in={selectedRecipe === "Recipe 1"}>
                <Box
                  sx={{
                    padding: 1,
                    backgroundColor: "#BFC0C0",
                    color: "black",
                    fontFamily: "Kanit, sans-serif",
                    fontWeight: "bold",
                    width: "100%",
                    marginTop: 1,
                  }}
                >
                  <Typography variant="body1" sx={{}}>
                    Ingredients consist of: 2 medium potatoes, 1/2 medium onion,
                    1/4 cp of all purpose flour, 1 egg, 1 cip oil, salt, pepper,
                    chilli flakes, and any extra seasoning you may want to add.
                    <br></br>
                    <br></br>
                    <Button
                      sx={{
                        textDecoration: "none",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <Link
                        href="https://www.allrecipes.com/recipe/57783/emilys-famous-hash-browns/"
                        target="_blank"
                        underline="none"
                        sx={{
                          textDecoration: "none",
                          textAlign: "center",
                          width: "100%",
                          color: "white",
                          backgroundColor: "#4F5D75",
                          "&:hover": { backgroundColor: "#174181" },
                          transition: "background-color 0.2s ease-in",
                          fontFamily: "Kanit, sans-serif",
                          fontWeight: "bold",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        Full Instructions
                      </Link>
                    </Button>
                  </Typography>
                </Box>
              </Collapse>
            </ListItem>

            <ListItem
              button
              onClick={() => handleRecipeClick("Recipe 2")}
              sx={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              <ListItemText
                primary="Brownies"
                sx={{
                  textTransform: "uppercase",
                  fontFamily: "Kanit, sans-serif",
                  fontWeight: "bold",
                  textAlign: "left",
                  width: "100%",
                }}
              />
              <Collapse in={selectedRecipe === "Recipe 2"}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: "#BFC0C0",
                    color: "black",
                    width: "100%",
                    marginTop: 1,
                  }}
                >
                  <Typography variant="body1">
                    Ingredients consist of: 1/2 cup butter, 1 cup of white
                    sugar, 2 eggs, 1 teaspoon of vanilla extract, 1/2 cup of
                    unsweetened cocoa powder, 1/2 cup of all purpose flour, 1/4
                    teaspoon of salt, and 1/4 teaspoon of faking powder.
                    <br></br>
                    <br></br>
                    <Button
                      sx={{
                        textDecoration: "none",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <Link
                        href="https://www.allrecipes.com/recipe/10549/best-brownies/"
                        target="_blank"
                        underline="none"
                        sx={{
                          textDecoration: "none",
                          textAlign: "center",
                          width: "100%",
                          color: "white",
                          backgroundColor: "#4F5D75",
                          "&:hover": { backgroundColor: "#174181" },
                          transition: "background-color 0.2s ease-in",
                          fontFamily: "Kanit, sans-serif",
                          fontWeight: "bold",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        Full Instructions
                      </Link>
                    </Button>
                  </Typography>
                </Box>
              </Collapse>
            </ListItem>

            <ListItem
              button
              onClick={() => handleRecipeClick("Recipe 3")}
              sx={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              <ListItemText
                primary="Tomato Soup"
                sx={{
                  textTransform: "uppercase",
                  fontFamily: "Kanit, sans-serif",
                  fontWeight: "bold",
                  textAlign: "left",
                  width: "100%",
                }}
              />
              <Collapse in={selectedRecipe === "Recipe 3"}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: "#BFC0C0",
                    color: "black",
                    width: "100%",
                    marginTop: 1,
                  }}
                >
                  <Typography variant="body1">
                    Ingredients consist of: 4 tablespoons of unsalted butter, 2
                    onions, 1 tablespoon of minced garlic, 1 tablespoon of all
                    purpose flower, 2 cans of tomatoes, 2 cups of chicken broth,
                    1/4 cup of basil, 2 tablespoons of sugar, 1/4 teaspoon of
                    salt, 1/2 teaspoon of black pepper, 1/3 cup of heavy cream,
                    and 1/4 teaspoon of baking soda.
                    <br></br>
                    <br></br>
                    <Button
                      sx={{
                        textDecoration: "none",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <Link
                        href="https://sugarspunrun.com/tomato-soup-recipe/#recipe"
                        target="_blank"
                        underline="none"
                        sx={{
                          textDecoration: "none",
                          textAlign: "center",
                          width: "100%",
                          color: "white",
                          backgroundColor: "#4F5D75",
                          "&:hover": { backgroundColor: "#174181" },
                          transition: "background-color 0.2s ease-in",
                          fontFamily: "Kanit, sans-serif",
                          fontWeight: "bold",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        Full Instructions
                      </Link>
                    </Button>
                  </Typography>
                </Box>
              </Collapse>
            </ListItem>

            <ListItem
              button
              onClick={() => handleRecipeClick("Recipe 4")}
              sx={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              <ListItemText
                primary="Chocolate Chip Cookies"
                sx={{
                  textTransform: "uppercase",
                  fontFamily: "Kanit, sans-serif",
                  fontWeight: "bold",
                  textAlign: "left",
                  width: "100%",
                }}
              />
              <Collapse in={selectedRecipe === "Recipe 4"}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: "#BFC0C0",
                    color: "black",
                    width: "100%",
                    marginTop: 1,
                  }}
                >
                  <Typography variant="body1">
                    Ingredients consist of: 8 tablespoons of salted butter, 1/2
                    cup of white sugar, 1/4 cup of packed light brown sugar, 1
                    teaspoon of vanilla, 1 egg, 2 cups of all purpose flour, 1/2
                    teaspoon of baking soda, 1/4 teaspoon of salt, and 3/4 cup
                    of chocolate chip
                    <br></br>
                    <br></br>
                    <Button
                      sx={{
                        textDecoration: "none",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <Link
                        href="https://pinchofyum.com/the-best-soft-chocolate-chip-cookies"
                        target="_blank"
                        underline="none"
                        sx={{
                          textDecoration: "none",
                          textAlign: "center",
                          width: "100%",
                          color: "white",
                          backgroundColor: "#4F5D75",
                          "&:hover": { backgroundColor: "#174181" },
                          transition: "background-color 0.2s ease-in",
                          fontFamily: "Kanit, sans-serif",
                          fontWeight: "bold",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        Full Instructions
                      </Link>
                    </Button>
                  </Typography>
                </Box>
              </Collapse>
            </ListItem>

            <ListItem
              button
              onClick={() => handleRecipeClick("Recipe 5")}
              sx={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              <ListItemText
                primary="Banana Bread"
                sx={{
                  textTransform: "uppercase",
                  fontFamily: "Kanit, sans-serif",
                  fontWeight: "bold",
                  textAlign: "left",
                  width: "100%",
                }}
              />
              <Collapse in={selectedRecipe === "Recipe 5"}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: "#BFC0C0",
                    color: "black",
                    width: "100%",
                    marginTop: 1,
                  }}
                >
                  <Typography variant="body1">
                    Ingredients consist of: 1/2 cup of butter, 1 cup of
                    granulated sugar, 2 eggs, 3 bananas, 2 cups of all purpose
                    flour, 1 teaspoon of baking soda, 1/2 teaspoon of salt, and
                    1/2 teaspoon of vanilla
                    <br></br>
                    <br></br>
                    <Button
                      sx={{
                        textDecoration: "none",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <Link
                        href="https://pinchofyum.com/the-best-soft-chocolate-chip-cookies"
                        target="_blank"
                        underline="none"
                        sx={{
                          textDecoration: "none",
                          textAlign: "center",
                          width: "100%",
                          color: "white",
                          backgroundColor: "#4F5D75",
                          "&:hover": { backgroundColor: "#174181" },
                          transition: "background-color 0.2s ease-in",
                          fontFamily: "Kanit, sans-serif",
                          fontWeight: "bold",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        Full Instructions
                      </Link>
                    </Button>
                  </Typography>
                </Box>
              </Collapse>
            </ListItem>
          </List>
        </Paper>

        {/* Main Content Section */}
        <Box
          sx={{
            width: "75%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                transform: "translate(-50%, -50%)",
                position: "absolute",
                top: "50%",
                left: "50%",
                width: { xs: "90%", sm: 400 },
                backgroundColor: "#BFC0C0",
                border: "2px solid #111",
                boxShadow: 24,
                p: 4,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  backgroundColor: "#BFC0C0",
                  color: "black",
                  textAlign: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontFamily: "Kanit, sans-serif",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Add Item
              </Typography>

              <Stack
                sx={{
                  width: "100%",
                  direction: "row",
                  spacing: 5,
                  alignItems: "center",
                  paddingBottom: "20px",
                }}
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    fontFamily: "Kanit, sans-serif",
                    fontWeight: "bold",
                    backgroundColor: "#4F5D75",
                    marginTop: "20px",
                    "&:hover": { backgroundColor: "#174181" },
                  }}
                  onClick={() => {
                    addItems(itemName);
                    setItemName("");
                    handleClose();
                  }}
                >
                  Add Your Item
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#174181",
              "&:hover": { backgroundColor: "" },
              fontFamily: "Kanit, sans-serif",
              fontWeight: "bold",
              fontSize: "30px",
              paddingLeft: "20px",
              paddingRight: "20px",
              marginBottom: "1px",
              marginTop: "40px",
              position: "relative",
              width: "100%",
            }}
            onClick={() => {
              handleOpen();
            }}
          >
            Add New Item
          </Button>

          <Box border="1px solid #BFC0C0" sx={{ width: "100%" }}>
            <Box
              sx={{
                width: "100%",
                height: "100px",
                backgroundColor: "#4F5D75",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h2"
                color="#FFF"
                sx={{
                  fontFamily: "Kanit, sans-serif",
                  textTransform: "uppercase",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  p: { xs: 1, sm: 2 },
                  fontWeight: "bold",
                }}
              >
                Your Pantry
              </Typography>
            </Box>

            <div>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  placeholder="Search pantry items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    boxSizing: "border-box",
                    color: "red",
                    fontWeight: "bold",
                  }}
                />
              </div>

              {searchQuery && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                      <div
                        key={item.name}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingBottom: "20px",
                        }}
                      >
                        <span>{item.name}</span>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        paddingBottom: "20px",
                        color: "red",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      No items found
                    </div>
                  )}
                </div>
              )}
            </div>
            <Stack
              width="100%"
              height="368px"
              spacing={2}
              sx={{ overflowY: "auto" }}
            >
              {inventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  height="70px"
                  minHeight="80px"
                  display="flex"
                  alignItems="center"
                  sx={{
                    boxSizing: "border-box",
                    backgroundColor: "#BFC0C0",
                    padding: 2,
                    flexDirection: "row",
                    overflow: "hidden",
                  }}
                >
                  {/* Item name section */}
                  <Box
                    sx={{
                      flex: "1 1 auto",
                      display: "flex",
                      alignItems: "center",
                      textAlign: "left",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="h3"
                      color="#111"
                      sx={{
                        fontSize: "30px",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        fontFamily: "Kanit, sans-serif",
                      }}
                    >
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                  </Box>

                  {/* Quantity section */}
                  <Box
                    sx={{
                      flex: "0 1 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "200px",
                    }}
                  >
                    <Typography
                      variant="h3"
                      color="#111"
                      sx={{
                        fontSize: "30px",
                        fontFamily: "Kanit, sans-serif",
                      }}
                    >
                      {quantity}
                    </Typography>
                  </Box>

                  {/* Buttons section */}
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      flex: "0 0 auto",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#4F5D75",
                        "&:hover": { backgroundColor: "#174181" },
                        fontFamily: "Kanit, sans-serif",
                        fontSize: "12px",
                      }}
                      onClick={() => addItems(name)}
                    >
                      Add Item
                    </Button>

                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#4F5D75",
                        "&:hover": { backgroundColor: "#174181" },
                        fontFamily: "Kanit, sans-serif",
                        fontSize: "12px",
                      }}
                      onClick={() => removeItems(name)}
                    >
                      Remove Item
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
