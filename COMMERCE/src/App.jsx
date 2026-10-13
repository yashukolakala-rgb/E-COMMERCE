import { useEffect, useState } from 'react'
import './App.css'

const starterProducts = [
  { id: 'p1', name: 'Arc table lamp', category: 'Home', price: 89, oldPrice: 120, rating: 4.9, reviews: 128, tag: 'Bestseller', color: 'sand', image: 'photo-1507473885765-e6ed057f782c', description: 'A sculptural, powder-coated lamp with a warm dimmable glow. Designed to make the end of the day feel a little softer.' },
  { id: 'p2', name: 'Everyday tote', category: 'Accessories', price: 48, rating: 4.8, reviews: 96, tag: 'New', color: 'blue', image: 'photo-1544816155-12df9643f363', description: 'A hardworking canvas carryall with a reinforced base, generous pockets, and just the right amount of structure.' },
  { id: 'p3', name: 'Studio headphones', category: 'Tech', price: 179, oldPrice: 220, rating: 4.7, reviews: 204, tag: 'Save 19%', color: 'olive', image: 'photo-1505740420928-5e560c06d30e', description: 'Rich, balanced sound and all-day comfort in a clean, considered silhouette. Includes a travel case and 30-hour battery.' },
  { id: 'p4', name: 'Stoneware set', category: 'Home', price: 64, rating: 4.9, reviews: 77, tag: '', color: 'peach', image: 'photo-1490312278390-ab64016e0aa9', description: 'Four everyday ceramic pieces with a tactile satin glaze. Made to mix, match, and live on your table.' },
  { id: 'p5', name: 'Field watch', category: 'Accessories', price: 145, rating: 4.6, reviews: 61, tag: '', color: 'yellow', image: 'photo-1523275335684-37898b6baf30', description: 'A reliable quartz movement, mineral crystal, and a comfortable recycled-nylon strap. Water resistant to 50 meters.' },
  { id: 'p6', name: 'Linen throw', category: 'Home', price: 112, rating: 4.8, reviews: 143, tag: 'Bestseller', color: 'green', image: 'photo-1600210492486-724fe5c67fb0', description: 'Soft, breathable linen woven in Portugal. A generous layer for the sofa, the bed, or a slow Sunday morning.' },
  { id: 'p7', name: 'Pocket camera', category: 'Tech', price: 329, rating: 4.7, reviews: 38, tag: 'Limited', color: 'violet', image: 'photo-1516035069371-29a1b244cc32', description: 'A compact digital camera with a bright lens, tactile controls, and a little character in every frame.' },
  { id: 'p8', name: 'Daily bottle', category: 'Accessories', price: 34, rating: 4.9, reviews: 312, tag: '', color: 'coral', image: 'photo-1602143407151-7111542de6e8', description: 'Double-wall insulated stainless steel keeps drinks cold for 24 hours. Leakproof, dishwasher safe, ready for anywhere.' },
]

const iconPaths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  close: <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  truck: <><path d="M3 6h12v11H3z" /><path d="M15 10h4l3 3v4h-7z" /><circle cx="7.5" cy="19" r="1.5" /><circle cx="18.5" cy="19" r="1.5" /></>,
}

function Icon({ name, size = 20, fill = 'none' }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>
}

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [products, setProducts] = useState(starterProducts)
  const [cart, setCart] = useState(() => readStorage('shopsphere-cart', []))
  const [wishlist, setWishlist] = useState(() => readStorage('shopsphere-wishlist', []))
  const [orders, setOrders] = useState(() => readStorage('shopsphere-orders', []))
  const [user, setUser] = useState(() => readStorage('shopsphere-user', null))
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [priceLimit, setPriceLimit] = useState(400)
  const [activeModal, setActiveModal] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [toast, setToast] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [orderForm, setOrderForm] = useState({ name: '', email: '', address: '', city: '', postal: '', payment: 'card' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/products`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('API unavailable')))
      .then((data) => { if (Array.isArray(data.products) && data.products.length) setProducts(data.products) })
      .catch(() => {})
  }, [])

  useEffect(() => { localStorage.setItem('shopsphere-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('shopsphere-wishlist', JSON.stringify(wishlist)) }, [wishlist])
  useEffect(() => { localStorage.setItem('shopsphere-orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => {
    if (user) localStorage.setItem('shopsphere-user', JSON.stringify(user))
    else localStorage.removeItem('shopsphere-user')
  }, [user])
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const categories = ['All', 'Home', 'Accessories', 'Tech']
  const visibleProducts = products
    .filter((product) => (category === 'All' || product.category === category) && product.price <= priceLimit)
    .filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'rating' ? b.rating - a.rating : 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savedProducts = products.filter((product) => wishlist.includes(product.id))

  function notify(message) { setToast(message) }

  function addToCart(product) {
    setCart((items) => {
      const exists = items.find((item) => item.id === product.id)
      return exists ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }]
    })
    notify(`${product.name} added to your bag`)
  }

  function changeQuantity(id, amount) {
    setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0))
  }

  function toggleWishlist(product) {
    const exists = wishlist.includes(product.id)
    setWishlist((items) => exists ? items.filter((id) => id !== product.id) : [...items, product.id])
    notify(exists ? 'Removed from your wishlist' : 'Saved to your wishlist')
  }

  async function submitAuth(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/${authMode}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.get('name'), email: form.get('email'), password: form.get('password') }),
      })
      if (response.ok) {
        const data = await response.json()
        setUser({ ...data.user, token: data.token })
        setActiveModal('')
        notify(`Welcome${data.user.name ? `, ${data.user.name.split(' ')[0]}` : ''}`)
        return
      }
      const data = await response.json().catch(() => ({}))
      if (response.status !== 404 && response.status !== 500) throw new Error(data.message || 'Could not sign in')
    } catch (error) {
      if (error.message !== 'Failed to fetch' && error.message !== 'API unavailable') {
        notify('Preview account ready. Connect the API for secure sign-in.')
      }
    } finally {
      const email = form.get('email')
      setUser({ name: form.get('name') || String(email).split('@')[0], email, role: 'customer' })
      setBusy(false)
      setActiveModal('')
      notify('Preview account ready')
    }
  }

  async function placeOrder(event) {
    event.preventDefault()
    if (!cart.length) return
    if (orderForm.payment === 'card' && !user?.token) {
      notify('Sign in and connect the API to use secure card checkout')
      return
    }
    setBusy(true)
    const newOrder = { id: `SS-${Date.now().toString().slice(-7)}`, items: cart, total: subtotal, status: 'Processing', date: new Date().toISOString(), customer: orderForm.name }
    try {
      if (user?.token) {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
          body: JSON.stringify({ items: cart.map(({ id, quantity }) => ({ product: id, quantity })), shippingAddress: { name: orderForm.name, email: orderForm.email, address: orderForm.address, city: orderForm.city, postalCode: orderForm.postal }, paymentMethod: orderForm.payment }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Could not place your order.')
        newOrder.id = data.order.orderNumber || newOrder.id
        if (orderForm.payment === 'card') {
          if (!data.checkoutUrl) throw new Error('Secure checkout is not available right now.')
          window.location.assign(data.checkoutUrl)
          return
        }
      }
    } catch (error) {
      if (user?.token || orderForm.payment === 'card') {
        notify(error.message || 'Could not place your order.')
        setBusy(false)
        return
      }
    }
    setOrders((items) => [newOrder, ...items])
    setCart([])
    setActiveModal('success')
    setBusy(false)
  }

  function startCheckout() {
    if (!cart.length) return notify('Your bag is empty')
    setOrderForm((form) => ({ ...form, name: user?.name || form.name, email: user?.email || form.email }))
    setActiveModal('checkout')
  }

  function productImage(product, width = 800) {
    return `https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=${width}&q=85`
  }

  return (
    <div className="storefront">
      <div className="announcement"><span>Complimentary shipping on orders over $100</span><span className="announcement-right">Thoughtful things, delivered with care <span aria-hidden="true">↗</span></span></div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="ShopSphere home">shop<span>sphere</span><i>.</i></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#shop" onClick={() => setCategory('All')}>Shop all</a>
          <a href="#shop" onClick={() => setCategory('Home')}>Home</a>
          <a href="#shop" onClick={() => setCategory('Accessories')}>Accessories</a>
          <a href="#shop" onClick={() => setCategory('Tech')}>Tech</a>
          <a href="#story">Our story</a>
        </nav>
        <div className="header-actions">
          <label className="search-box"><Icon name="search" size={18} /><input aria-label="Search products" placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <button className="icon-button account-button" aria-label={user ? 'Open your account' : 'Sign in'} title={user ? 'Account' : 'Sign in'} onClick={() => setActiveModal('account')}><Icon name="user" /></button>
          <button className="icon-button wishlist-button" aria-label="View saved items" title="Wishlist" onClick={() => setActiveModal('wishlist')}><Icon name="heart" /><span className="action-count">{wishlist.length}</span></button>
          <button className="icon-button bag-button" aria-label={`Open bag, ${cartCount} items`} title="Shopping bag" onClick={() => setActiveModal('cart')}><Icon name="bag" /><span className="action-count">{cartCount}</span></button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> A little more considered</p><h1>Good things.<br /><em>Well found.</em></h1><p className="hero-description">A thoughtful edit of everyday objects, made to be kept, used, and loved.</p><a className="primary-button hero-cta" href="#shop">Explore the collection <Icon name="arrow" size={17} /></a><div className="hero-note"><span className="hero-note-icon"><Icon name="star" size={14} fill="currentColor" /></span> Independent makers. Better materials. Always.</div></div>
          <div className="hero-image-wrap"><img src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1400&q=90" alt="Handmade ceramic pieces on a sunlit table" /><div className="hero-image-caption"><span>Objects for slower living</span><span>01 / 04</span></div></div>
          <div className="hero-side-label">THE EVERYDAY EDIT&nbsp; · &nbsp;VOL. 04</div>
        </section>

        <section className="benefit-strip" aria-label="Shopping benefits"><div><Icon name="truck" size={19} /><span><strong>Free shipping</strong> over $100</span></div><div><span className="benefit-dot" /><span><strong>Made to last</strong> — always</span></div><div><span className="benefit-dot" /><span><strong>Easy returns</strong> within 30 days</span></div><div className="benefit-review"><span>★★★★★</span><span>4.9 / 5 from 2,400+ happy homes</span></div></section>

        <section id="shop" className="shop-section">
          <div className="section-heading"><div><p className="eyebrow">THE GOOD STUFF</p><h2>Find your next <em>favorite.</em></h2></div><a className="text-link" href="#shop" onClick={() => { setCategory('All'); setQuery(''); setPriceLimit(400) }}>Shop everything <Icon name="arrow" size={16} /></a></div>
          <div className="shop-toolbar"><div className="category-tabs" role="tablist" aria-label="Product categories">{categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="sort-control"><label htmlFor="sort-products">Sort by</label><select id="sort-products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></div></div>
          <div className="catalog-layout"><aside className="filter-sidebar"><div className="filter-heading"><span>Refine by</span><button onClick={() => { setCategory('All'); setPriceLimit(400) }}>Reset</button></div><div className="filter-group"><h3>Category</h3>{categories.slice(1).map((item) => <button key={item} className="filter-option" onClick={() => setCategory(category === item ? 'All' : item)}><span className={`checkbox ${category === item ? 'checked' : ''}`}>{category === item ? '✓' : ''}</span>{item}<span className="filter-count">{products.filter((product) => product.category === item).length}</span></button>)}</div><div className="filter-group price-filter"><div className="price-heading"><h3>Price</h3><span>Up to ${priceLimit}</span></div><input aria-label="Maximum price" type="range" min="35" max="400" step="5" value={priceLimit} onChange={(event) => setPriceLimit(Number(event.target.value))} /><div className="price-scale"><span>$35</span><span>$400+</span></div></div><div className="filter-note"><span>↗</span><p>Good design should feel good, too. Every maker in our shop shares our values.</p></div></aside>
            <div className="product-grid" aria-live="polite">{visibleProducts.map((product, index) => <article className="product-card" key={product.id}><div className={`product-image ${product.color}`}><button className={`save-button ${wishlist.includes(product.id) ? 'saved' : ''}`} aria-label={wishlist.includes(product.id) ? `Remove ${product.name} from wishlist` : `Save ${product.name}`} onClick={() => toggleWishlist(product)}><Icon name="heart" size={18} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} /></button>{product.tag && <span className="product-tag">{product.tag}</span>}<button className="product-image-button" aria-label={`View ${product.name} details`} onClick={() => { setSelectedProduct(product); setActiveModal('product') }}><img src={productImage(product)} alt={product.name} loading={index > 3 ? 'lazy' : 'eager'} /></button><button className="quick-add" onClick={() => addToCart(product)}>Quick add <Icon name="plus" size={15} /></button></div><div className="product-info"><div className="product-title-line"><button className="product-name" onClick={() => { setSelectedProduct(product); setActiveModal('product') }}>{product.name}</button><span className="product-price">${product.price}</span></div><div className="product-meta"><span>{product.category}</span><span className="rating"><Icon name="star" size={12} fill="currentColor" /> {product.rating} <span className="review-count">({product.reviews})</span></span></div></div></article>)}{visibleProducts.length === 0 && <div className="empty-results"><span>Nothing here just yet.</span><p>Try another search or adjust your filters.</p><button className="text-link" onClick={() => { setCategory('All'); setQuery(''); setPriceLimit(400) }}>Clear filters <Icon name="arrow" size={15} /></button></div>}</div>
          </div>
          <div className="catalog-footer">Showing {visibleProducts.length} of {products.length} considered finds <span className="footer-dash" /></div>
        </section>

        <section id="story" className="story-section"><div className="story-image"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85" alt="A calm, carefully curated design studio" loading="lazy" /><span>MADE WITH INTENTION</span></div><div className="story-copy"><p className="eyebrow">A NOTE FROM US</p><h2>Less, but<br /><em>lovelier.</em></h2><p>We believe the things we bring into our homes should earn their place. So we look for independent makers, honest materials, and the kind of design that gets better with time.</p><a className="text-link" href="#story">Get to know us <Icon name="arrow" size={16} /></a><div className="story-signoff">The ShopSphere team <span>✳</span></div></div></section>

        <section className="newsletter"><div><p className="eyebrow">A GOOD NOTE, NOW AND THEN</p><h2>A little inspiration<br />for your <em>inbox.</em></h2></div><form onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); notify('You are on the list. Talk soon!') }}><label htmlFor="newsletter-email">The occasional edit of new finds and maker stories.</label><div className="newsletter-field"><input id="newsletter-email" type="email" placeholder="Your email address" required /><button aria-label="Subscribe to newsletter"><Icon name="arrow" size={19} /></button></div><p>By subscribing, you agree to our friendly email policy.</p></form><span className="newsletter-stamp">GOOD<br />THINGS<br />AHEAD</span></section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-mark" href="#top">shop<span>sphere</span><i>.</i></a><span>Thoughtful things for everyday living.</span><div><a href="#shop">Shop</a><a href="#story">About</a><a href="#story">Contact</a><a href="#top">Instagram ↗</a></div><small>© 2026 ShopSphere. Made for the long run.</small></footer>

      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
      {activeModal && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveModal('') }}>
        {activeModal === 'cart' && <section className="side-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div className="panel-header"><div><p className="eyebrow">YOUR GOOD FINDS</p><h2 id="cart-title">Your bag <span>({cartCount})</span></h2></div><button className="icon-button" aria-label="Close bag" onClick={() => setActiveModal('')}><Icon name="close" /></button></div>{cart.length ? <><div className="panel-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={productImage(item, 300)} alt={item.name} /><div className="cart-item-info"><strong>{item.name}</strong><span>{item.category}</span><div className="quantity-control"><button aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item.id, -1)}><Icon name="minus" size={13} /></button><span>{item.quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item.id, 1)}><Icon name="plus" size={13} /></button></div></div><strong className="cart-item-price">${item.price * item.quantity}</strong></div>)}</div><div className="cart-summary"><div className="shipping-progress"><span>✓</span> Complimentary shipping unlocked</div><div className="subtotal-line"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><p>Taxes and shipping calculated at checkout.</p><button className="primary-button full-button" onClick={startCheckout}>Continue to checkout <Icon name="arrow" size={17} /></button><button className="continue-shopping" onClick={() => setActiveModal('')}>Keep looking</button></div></> : <div className="panel-empty"><span className="empty-bag"><Icon name="bag" size={25} /></span><h3>Your bag is taking a little break.</h3><p>Find something lovely to bring home.</p><button className="primary-button" onClick={() => { setActiveModal(''); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}>Browse the collection</button></div>}</section>}

        {activeModal === 'wishlist' && <section className="side-panel" role="dialog" aria-modal="true" aria-labelledby="wishlist-title"><div className="panel-header"><div><p className="eyebrow">KEPT CLOSE</p><h2 id="wishlist-title">Your wishlist <span>({wishlist.length})</span></h2></div><button className="icon-button" aria-label="Close wishlist" onClick={() => setActiveModal('')}><Icon name="close" /></button></div>{savedProducts.length ? <div className="panel-items">{savedProducts.map((product) => <div className="cart-item" key={product.id}><img src={productImage(product, 300)} alt={product.name} /><div className="cart-item-info"><strong>{product.name}</strong><span>{product.category}</span><button className="wishlist-add" onClick={() => addToCart(product)}>Add to bag · ${product.price}</button></div><button className="icon-button remove-saved" aria-label={`Remove ${product.name}`} onClick={() => toggleWishlist(product)}><Icon name="close" size={17} /></button></div>)}</div> : <div className="panel-empty"><span className="empty-bag"><Icon name="heart" size={25} /></span><h3>Save a little something.</h3><p>Tap the heart on anything you love.</p><button className="primary-button" onClick={() => { setActiveModal(''); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore the shop</button></div>}</section>}

        {activeModal === 'account' && <section className="dialog-card account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title"><button className="icon-button dialog-close" aria-label="Close account" onClick={() => setActiveModal('')}><Icon name="close" /></button>{user ? <><p className="eyebrow">YOUR SHOPSPHERE</p><h2 id="account-title">Hello, <em>{user.name?.split(' ')[0] || 'friend'}.</em></h2><p className="account-email">{user.email}</p><div className="account-menu"><button onClick={() => setActiveModal('orders')}>Order history <span>{orders.length} orders ↗</span></button><button onClick={() => setActiveModal('wishlist')}>Saved items <span>{wishlist.length} saved ↗</span></button>{user.role === 'admin' && <button onClick={() => setActiveModal('admin')}>Admin workspace <span>Manage store ↗</span></button>}</div><button className="text-link signout-link" onClick={() => { setUser(null); notify('You have signed out'); setActiveModal('') }}>Sign out <Icon name="arrow" size={15} /></button></> : <><p className="eyebrow">A BETTER WAY TO SHOP</p><h2 id="account-title">{authMode === 'login' ? <>Welcome <em>back.</em></> : <>Make yourself <em>at home.</em></>}</h2><p className="dialog-intro">Keep track of your orders and save your favorite finds.</p><form className="form-stack" onSubmit={submitAuth}>{authMode === 'register' && <label>Your name<input name="name" autoComplete="name" required placeholder="Alex Morgan" /></label>}<label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Password<input name="password" type="password" minLength="8" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} required placeholder="At least 8 characters" /></label><button className="primary-button full-button" disabled={busy}>{busy ? 'One moment…' : authMode === 'login' ? 'Sign in' : 'Create account'} <Icon name="arrow" size={17} /></button></form><p className="switch-auth">{authMode === 'login' ? 'New around here?' : 'Already have an account?'} <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>{authMode === 'login' ? 'Create an account' : 'Sign in'}</button></p></>}</section>}

        {activeModal === 'product' && selectedProduct && <section className="dialog-card product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title"><button className="icon-button dialog-close" aria-label="Close product details" onClick={() => setActiveModal('')}><Icon name="close" /></button><div className={`detail-image ${selectedProduct.color}`}><img src={productImage(selectedProduct, 900)} alt={selectedProduct.name} /></div><div className="detail-copy"><p className="eyebrow">{selectedProduct.category.toUpperCase()} · SHOPSPHERE EDIT</p><h2 id="product-dialog-title">{selectedProduct.name}</h2><div className="detail-rating"><span>★★★★★</span> {selectedProduct.rating} ({selectedProduct.reviews} reviews)</div><p className="detail-description">{selectedProduct.description}</p><div className="detail-price">${selectedProduct.price}{selectedProduct.oldPrice && <del>${selectedProduct.oldPrice}</del>}</div><button className="primary-button full-button" onClick={() => { addToCart(selectedProduct); setActiveModal('cart') }}>Add to bag <Icon name="arrow" size={17} /></button><button className="detail-save" onClick={() => toggleWishlist(selectedProduct)}><Icon name="heart" size={17} fill={wishlist.includes(selectedProduct.id) ? 'currentColor' : 'none'} /> {wishlist.includes(selectedProduct.id) ? 'Saved to wishlist' : 'Save for later'}</button><p className="detail-shipping"><Icon name="truck" size={17} /> Free shipping over $100 · Easy 30-day returns</p></div></section>}

        {activeModal === 'checkout' && <section className="dialog-card checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><button className="icon-button dialog-close" aria-label="Close checkout" onClick={() => setActiveModal('cart')}><Icon name="close" /></button><p className="eyebrow">ALMOST YOURS</p><h2 id="checkout-title">A few final <em>details.</em></h2><form className="form-stack checkout-form" onSubmit={placeOrder}><label>Full name<input required autoComplete="name" value={orderForm.name} onChange={(event) => setOrderForm({ ...orderForm, name: event.target.value })} /></label><label>Email<input type="email" required autoComplete="email" value={orderForm.email} onChange={(event) => setOrderForm({ ...orderForm, email: event.target.value })} /></label><label>Street address<input required autoComplete="street-address" value={orderForm.address} onChange={(event) => setOrderForm({ ...orderForm, address: event.target.value })} /></label><div className="form-row"><label>City<input required autoComplete="address-level2" value={orderForm.city} onChange={(event) => setOrderForm({ ...orderForm, city: event.target.value })} /></label><label>Postal code<input required autoComplete="postal-code" value={orderForm.postal} onChange={(event) => setOrderForm({ ...orderForm, postal: event.target.value })} /></label></div><label>Payment method<select value={orderForm.payment} onChange={(event) => setOrderForm({ ...orderForm, payment: event.target.value })}><option value="card">Card · secure payment setup required</option><option value="cod">Pay on delivery</option></select></label><div className="checkout-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div><button className="primary-button full-button" disabled={busy}>{busy ? 'Placing your order…' : 'Place order'} <Icon name="arrow" size={17} /></button><p className="secure-note">Your details are encrypted and handled securely.</p></form></section>}

        {activeModal === 'success' && <section className="dialog-card success-dialog" role="dialog" aria-modal="true" aria-labelledby="success-title"><span className="success-mark">✓</span><p className="eyebrow">ORDER CONFIRMED</p><h2 id="success-title">On its way to <em>you.</em></h2><p>Thanks for finding something good with us. Your order <strong>{orders[0]?.id}</strong> is in the works.</p><button className="primary-button" onClick={() => setActiveModal('orders')}>Track your order <Icon name="arrow" size={17} /></button><button className="continue-shopping" onClick={() => setActiveModal('')}>Back to the shop</button></section>}

        {activeModal === 'orders' && <section className="dialog-card orders-dialog" role="dialog" aria-modal="true" aria-labelledby="orders-title"><button className="icon-button dialog-close" aria-label="Close order history" onClick={() => setActiveModal(user ? 'account' : '')}><Icon name="close" /></button><p className="eyebrow">THE JOURNEY HOME</p><h2 id="orders-title">Your <em>orders.</em></h2>{orders.length ? <div className="order-list">{orders.map((order) => <article className="order-row" key={order.id}><div><strong>{order.id}</strong><span>{new Date(order.date).toLocaleDateString()} · {order.items.length} item{order.items.length === 1 ? '' : 's'}</span></div><div className="order-status"><span>{order.status}</span><strong>${order.total.toFixed(2)}</strong></div><div className="order-progress"><span /></div><small>Order received <span>Processing</span> On its way Delivered</small></article>)}</div> : <div className="orders-empty"><p>Your next good find will show up here.</p><button className="text-link" onClick={() => { setActiveModal(''); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}>Browse the shop <Icon name="arrow" size={15} /></button></div>}</section>}

        {activeModal === 'admin' && user?.role === 'admin' && <section className="dialog-card admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-title"><button className="icon-button dialog-close" aria-label="Close admin workspace" onClick={() => setActiveModal('account')}><Icon name="close" /></button><p className="eyebrow">SHOPSPHERE · OPERATIONS</p><h2 id="admin-title">Store <em>overview.</em></h2><div className="admin-metrics"><div><span>Revenue</span><strong>${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</strong><small>All time</small></div><div><span>Orders</span><strong>{orders.length}</strong><small>All time</small></div><div><span>Products</span><strong>{products.length}</strong><small>In catalog</small></div><div><span>Low stock</span><strong>2</strong><small>Needs attention</small></div></div><h3 className="admin-subhead">Recent orders</h3>{orders.length ? orders.slice(0, 5).map((order) => <div className="admin-order" key={order.id}><span>{order.id}</span><span>{order.customer || 'Customer'}</span><strong>${order.total.toFixed(2)}</strong><span className="status-pill">{order.status}</span></div>) : <p className="admin-empty">New orders will appear here. Product, payment, inventory, and customer management APIs are available in the server workspace.</p>}</section>}
      </div>}
    </div>
  )
}

export default App
