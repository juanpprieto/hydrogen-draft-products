import {Link} from '@shopify/hydrogen';

export default function Home() {
  return (
    <div>
      <h1>Draft product previews Demo</h1>
      <p>
        This demo illustrates how to <b>preview draft products</b> in Hydrogen.
      </p>
      <div>
        <h3>Published Product</h3>
        <Link to='/products/bedside-table'>Bedside Table</Link>
      </div>
      <div>
        <h3>Draft Product</h3>
        <Link to='/products/antique-drawers'>Antique Drawers (production)</Link> — <span>will redirect to 404</span>
        <br />
        <div>
          <Link to='/products/antique-drawers?preview=true'>Antique Drawers (preview)</Link> — <span>will resolve by appending <i>`?preview=true`</i> to the url</span>
        </div>
      </div>
    </div>
  )
}
