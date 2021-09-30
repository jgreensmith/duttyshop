import { Card, CardActionArea, CardContent, CardMedia, Grid, Slide, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css'
import getCommerce from '../utils/commerce'

export default function Home(props) {
  const { products } = props;
  return (
    <Layout title="Home" commercePublicKey={props.commercePublicKey}>
      {products.length === 0 && alert("no products bruh")}
      <Grid container spacing={1}>
       {products.map((product) => (
          <Grid key={product.id} item md={3}>
          <Slide direction="up" in={true}>
            <Card>
              <Link href={`/products/${product.permalink}`}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    alt={product.name}
                    image={product.media.source}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="body2"
                      color="textPrimary"
                      component="p"
                    >
                      {product.name}
                    </Typography>
                    <Box>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        component="p"
                      >
                        {product.price.formatted_with_symbol}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          </Slide>
        </Grid>
       ))}
      </Grid>
    </Layout>
  )
}

export async function getStaticProps() {
  const commerce = getCommerce();
  const { data: products } = await commerce.products.list();
  return {
    props: {
      products,
    }
  }
}
