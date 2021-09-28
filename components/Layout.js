import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import { AppBar, CssBaseline, Toolbar, Link, Container, Box, Typography } from '@mui/material';
import { theme, StyledTitle } from '../utils/styles';
import NextLink from 'next/link';

export default function Layout ({
    children,
    commercePublicKey,
    title = 'duttyshop',
}) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>{`${title} - duttyshop`}</title>
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
                                    Cart
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