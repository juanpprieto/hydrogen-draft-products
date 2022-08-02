import {Link, gql, useQuery, useShopQuery} from '@shopify/hydrogen';
import {graphqlAdmin} from '../../lib/graphqlAdmin'

export default function Product({request, response, params, search: searchString}) {
  const search = new URLSearchParams(searchString);
  const isPreview = search.has('preview') && search.get('preview') === 'true';

  let product;

  if (isPreview) {
    // In preview mode, we fetch from the Admin API.
    const {data, error} = useQuery(['product', params.handle], async () => {
      const {data} = await graphqlAdmin({
        query: DRAFT_PRODUCT_QUERY,
        variables: {handle: params.handle}
      })

      return data;
    });

    if (error || typeof data?.product !== 'undefined' && !data?.product) {
      return response.redirect(`/404?resource=/products/${params.handle}`);
    } else {
      product = data?.product;
    }
  } else {
    // Not in preview mode, we fetch normally from Storefront API.
    const {data, error} = useShopQuery({
      query: PUBLISHED_PRODUCT_QUERY,
      variables: {handle: params.handle},
      preload: true,
    })

    if (error || typeof data?.product !== 'undefined' && !data?.product) {
      return response.redirect(`/404?resource=/products/${params.handle}`);
    } else {
      product = data?.product;
    }
  }

  const badgeStyle = {
    backgroundColor: isPreview ? 'yellow' : 'green',
    padding: '0.25rem 0.5rem',
  }

  const normalizedProduct = product
    ? normalizeProduct(product)
    : null;

  return (
    normalizedProduct
      ? <div>
          <div >Fetched via <span style={badgeStyle}>{isPreview ? 'Admin API' : 'Storefront API'}</span></div>
          <h1>Product {params.handle}</h1>
          <p>Title: {normalizedProduct.title}</p>
          <br />
          <Link to='/'>Back home</Link>
        </div>
      : null
  );
}

/*
  Note:
  Because the [Admin API](https://shopify.dev/api/admin-graphql/2022-04/objects/Product)
  and [Storefront API](https://shopify.dev/api/storefront/2022-04/objects/Product) product objects are slightly different,
  I'd recommend having a `normalizeProduct(product)` function that ensures consistency across both APIs.
*/
function normalizeProduct(rawProduct) {
  // Add logic to make sure the AdminAPI and SFAPI product object is consistent
  return rawProduct;
}

// In preview, get product from the Admin API because it includes draft products
const DRAFT_PRODUCT_QUERY = gql`
  query DraftProduct ($handle: String!){
    product: productByHandle(handle: $handle) {
      status
      title
      # ....
    }
  }
`;

// In production, get product from the Storefront API because it doesn't include draft products
const PUBLISHED_PRODUCT_QUERY = gql`
  query PublishedProduct ($handle: String!){
    product(handle: $handle) {
      title
      # ....
    }
  }
`;
