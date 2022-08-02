import {Link} from '@shopify/hydrogen';

export default function NotFound({search}) {
  const params = new URLSearchParams(search);
  return (
    <div>
      <h1>Page not found ☹️</h1>
      {params.has('resource') && (<p>Resource: <code>{params.get('resource')}</code></p>)}
      <Link to='/'>Back home</Link>
    </div>
  )
}