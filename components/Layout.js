import React, { useContext, useEffect } from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import { AppBar, CssBaseline, Toolbar, Link, Container, Box, Typography, CircularProgress, Badge } from '@mui/material';
import { theme, StyledTitle } from '../utils/styles';
import NextLink from 'next/link';
import { Store } from './Store';
import { CART_RETRIEVE_REQUEST, CART_RETRIEVE_SUCCESS } from '../utils/constants';
import getCommerce from '../utils/commerce';

export default function Layout ({
    children,
    commercePublicKey,
    title = 'duttyshop',
}) {

    const { state, dispatch } = useContext(Store);
    const { cart } = state;

    useEffect(() => {
        const fetchCart = async () => {
            const commerce = getCommerce(commercePublicKey);
            dispatch({ type: CART_RETRIEVE_REQUEST });
            const cartData = await commerce.cart.retrieve();
            dispatch({ type: CART_RETRIEVE_SUCCESS, payload: cartData });
        };
        fetchCart();
    }, []);

    console.log(cart.data);

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>{`${title} | duttyshop`}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar 
                    position="static"
                    color="default"
                    elevation={0}
                    sx={{ 
                        borderBottom: 2,
                        borderColor: 'divider',
                    }}
                >
                   <Toolbar sx={{ flexWrap: 'wrap' }} >
                       <NextLink href="/">
                           <Link 
                                variant="h6"
                                color="inherit"
                                noWrap
                                href="/"
                                sx={{ 
                                    flexGrow: 1,
                                    textDecoration: 'none', 
                                }}
                                
                           >
                               <StyledTitle>
                                    DuttyShop
                               </StyledTitle>
                               
                           </Link>
                       </NextLink>
                       <nav>
                            <NextLink href="/cart">
                                <Link 
                                        variant="button"
                                        color="textPrimary"
                                        href="/cart"
                                        sx={{ margin: '1rem' }}      
                                >
                                    {cart.loading ? (
                                        <CircularProgress />
                                    ) : cart.data.total_items > 0 ? (
                                        <Badge badgeContent={cart.data.total_items} color='primary'>
                                            Cart
                                        </Badge>   
                                    ) : (
                                        'Cart'
                                    )}
                                </Link>
                            </NextLink>
                       </nav>
                   </Toolbar>
                </AppBar>
                <Container component="main" sx={{ padding: '1rem' }}>
                    {children}
                </Container>
                <Container maxWidth="md" component="footer">
                    <Box mt={5}>
                        <Typography variant="body2" color="textSecondary" align="center">
                            {'© '}
                            DuttyShop 2021
                            {'.'}
                        </Typography>
                    </Box>
                </Container>

            </ThemeProvider>
        </>
    )
}