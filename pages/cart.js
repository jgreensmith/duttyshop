import { 
    Alert, 
    Button, 
    Card, 
    CardActionArea, 
    CardContent, 
    CardMedia, 
    CircularProgress, 
    Grid, 
    List, 
    ListItem, 
    MenuItem, 
    Select, 
    Slide, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography 
} from '@mui/material';
import dynamic from 'next/dynamic';
import { Box } from '@mui/system';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import { Store } from '../components/Store';
import styles from '../styles/Home.module.css'
import getCommerce from '../utils/commerce'
import { CART_RETRIEVE_SUCCESS } from '../utils/constants';
import Router from 'next/router';

function Cart(props) {
    const { state, dispatch } = useContext(Store);
    const { cart } = state;

    const removeFromCartHandler = async (lineItem) => {
      const commerce = getCommerce(props.commercePublicKey);
      const cartData = await commerce.cart.remove(lineItem.id);
      dispatch({ type: CART_RETRIEVE_SUCCESS, payload: cartData.cart });
    };

    // const quantityChangeHandler = async (lineItem, quantity) => {
    //     const commerce = getCommerce(props.commercePublicKey);
    //     const cartData = await commerce.cart.update(lineItem.id, {
    //         quantity,
    //     });
    //     dispatch({ type: CART_RETRIEVE_SUCCESS, payload: cartData.cart });
    // };

    //use this code if seller has unlimited supply 

    const procceedToCheckoutHandler = () => {
        Router.push('/checkout');
    };
    return (
        <Layout title="Cart" commercePublicKey={props.commercePublicKey}>
            {cart.loading ? (
                <CircularProgress />
            ) : cart.data.line_items.length === 0 ? (
                <Alert icon={false} severity="error">
                    Cart is empty. <Link href="/">Go shopping</Link>
                </Alert>
            ) : (
                <React.Fragment>
                    <Typography variant="h1" component="h1">
                        Shopping Cart
                    </Typography>
                    <Slide direction="up" in={true}>
                        <Grid container spacing={1}>
                            <Grid item md={9}>
                                <TableContainer>
                                    <Table aria-label="Orders">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cart.data.line_items.map((cartItem) => (
                                                <TableRow key={cartItem.name}>
                                                    <TableCell component="th" scope="row">
                                                        {cartItem.name}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {/* <Select
                                                            labelId="quanitity-label"
                                                            id="quanitity"
                                                            onChange={(e) =>
                                                                quantityChangeHandler(cartItem, e.target.value)
                                                            }
                                                            value={cartItem.quantity}
                                                        >
                                                            {[...Array(15).keys()].map((x) => (
                                                                <MenuItem key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </MenuItem>
                                                            ))}
                                                        </Select> */}
                                                        {cartItem.quantity}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {cartItem.price.formatted_with_symbol}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            onClick={() => removeFromCartHandler(cartItem)}
                                                            variant="contained"
                                                            color="secondary"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </TableCell>
                                            </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <Card>
                                    <List>
                                        <ListItem>
                                            <Grid container>
                                                <Typography variant="h6">
                                                    Subtotal: {cart.data.subtotal.formatted_with_symbol}
                                                </Typography>
                                            </Grid>
                                        </ListItem>
                                        <ListItem>
                                            {cart.data.total_items > 0 && (
                                                <Button
                                                    type="button"
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={procceedToCheckoutHandler}
                                                >
                                                    Proceed to checkout
                                                </Button>
                                            )}
                                        </ListItem>
                                    </List>
                                </Card>
                            </Grid>
                        </Grid>
                    </Slide>
                </React.Fragment>
            )}
        </Layout>
    )
}

export default dynamic(() => Promise.resolve(Cart), {
    ssr: false,
});

// only rendered clientside

// export async function getServerSideProps(context) {
//     const { id } = params;
//     const commerce = getCommerce();
//     const product = await commerce.products.retrieve(id);
//     return {
//         props: {
//             product,
//         }
//     }
// }

// export async function getStaticProps(id) {
//     const commerce = getCommerce();
//     const { data: product } = await commerce.products.retrieve(id);
//     return {
//       props: {
//         product,
//       }
//     }
//   }