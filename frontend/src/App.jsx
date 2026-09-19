import { useEffect, useState } from "react";
import "./App.css";
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleSubmit = (e) => {
  e.preventDefault();

  const enteredEmail = email.trim().toLowerCase();
  const enteredPassword = password;

  if (!enteredEmail || !enteredPassword) {
    alert("Please enter email and password.");
    return;
  }

  // =========================
  // REGISTER
  // =========================
  if (mode === "register") {

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    const account = {
      name: name.trim(),
      email: enteredEmail,
      password: enteredPassword
    };

    localStorage.setItem(
      "speakeasy_account",
      JSON.stringify(account)
    );

    alert(
      "Account created successfully! Please login."
    );

    // Go to LOGIN
    setMode("login");

    // Clear fields
    setName("");
    setEmail("");
    setPassword("");

    return;
  }

  // =========================
  // LOGIN
  // =========================

  const savedAccount =
    localStorage.getItem("speakeasy_account");

  if (!savedAccount) {
    alert(
      "No account found. Please register first."
    );

    setMode("register");

    return;
  }

  const account = JSON.parse(savedAccount);

  if (
  enteredEmail === account.email &&
  enteredPassword === account.password
) {

  const loggedInUser = {
    name: account.name,
    email: account.email
  };

  localStorage.setItem(
    "speakeasy_user",
    JSON.stringify(loggedInUser)
  );

  onLogin(loggedInUser);

} else {

  alert(
    "Invalid email or password. Please check your registered details."
  );

}
};

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          📦
        </div>

        <h1>SpeakEasy Stock</h1>

        <p className="auth-subtitle">
          Voice-first inventory management
        </p>

        <div className="auth-tabs">
  <button
    type="button"
    className={mode === "login" ? "active" : ""}
    onClick={() => setMode("login")}
  >
    Login
  </button>

  <button
    type="button"
    className={mode === "register" ? "active" : ""}
    onClick={() => setMode("register")}
  >
    Register
  </button>
</div>

        <form onSubmit={handleSubmit}>

          {mode === "register" && (
            <div className="auth-field">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
          >
            {mode === "login"
              ? "Login"
              : "Create Account"}
          </button>

        </form>

        <p className="auth-footer">
          {mode === "login"
            ? "New to SpeakEasy Stock?"
            : "Already have an account?"}

          <button
            onClick={() =>
              setMode(
                mode === "login"
                  ? "register"
                  : "login"
              )
            }
          >
            {mode === "login"
              ? " Register"
              : " Login"}
          </button>
        </p>

      </div>

    </div>
  );
}


  function App() {
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("speakeasy_user");
  return savedUser ? JSON.parse(savedUser) : null;
});

  const [activePage, setActivePage] = useState("dashboard");

  const handleLogout = () => {
  localStorage.removeItem("speakeasy_user");
  setUser(null);
  setActivePage("dashboard");
};

  if (!user) {
    return (
      <AuthPage
        onLogin={(loggedInUser) =>
          setUser(loggedInUser)
        }
      />
    );
  }

  const menuItems = [
    { id: "dashboard", icon: "⌂", label: "Dashboard" },
    { id: "products", icon: "▣", label: "Products" },
    { id: "voice", icon: "🎤", label: "Voice Stock" },
    { id: "alerts", icon: "⚠", label: "Alerts" },
    { id: "history", icon: "◷", label: "History" },
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>SpeakEasy</h2>
            <span>Stock</span>
          </div>
        </div>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

<div className="sidebar-bottom">

  <div className="language-box">
    <span>🌐</span>
    <div>
      <small>Language</small>
      <strong>English</strong>
    </div>
  </div>

  <div className="user-box">
    <div className="user-avatar">
      {user.name.charAt(0).toUpperCase()}
    </div>

    <div className="user-info">
      <strong>{user.name}</strong>
      <small>{user.email}</small>
    </div>
  </div>

  <button
    className="logout-button"
    onClick={handleLogout}
  >
    🚪 Logout
  </button>

</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">INVENTORY MANAGEMENT</p>
            <h1>Good evening 👋</h1>
          </div>

          <button
            className="voice-header-button"
            onClick={() => setActivePage("voice")}
          >
            <span>🎤</span>
            Speak to Stock
          </button>
        </header>

        <section className="page-content">
          {activePage === "dashboard" && (
  <Dashboard onNavigate={setActivePage} />
)}
          {activePage === "products" && <Products />}
          {activePage === "voice" && <VoiceStock />}
          {activePage === "alerts" && <Alerts />}
          {activePage === "history" && <History />}
        </section>
      </main>
    </div>
  );
}


function Dashboard({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({
    total_products: 0,
    low_stock: 0,
    healthy_stock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const productsResponse = await fetch(
          "http://127.0.0.1:8000/products"
        );

        const productsData = await productsResponse.json();

        const summaryResponse = await fetch(
          "http://127.0.0.1:8000/products/insights/summary"
        );

        const summaryData = await summaryResponse.json();

        setProducts(productsData);
        setSummary(summaryData);

      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const getStatus = (product) => {
    if (product.current_stock <= product.minimum_stock) {
      return "critical";
    }

    if (
      product.current_stock <=
      product.minimum_stock * 1.5
    ) {
      return "low";
    }

    return "healthy";
  };

  const getCategory = (product) => {
    const name = product.name.toLowerCase();

    if (
      name.includes("rice") ||
      name.includes("sugar") ||
      name.includes("oil") ||
      name.includes("flour")
    ) {
      return "Grocery";
    }

    if (
      name.includes("biscuit") ||
      name.includes("chips") ||
      name.includes("snack")
    ) {
      return "Snacks";
    }

    return "General";
  };

  if (loading) {
    return (
      <div className="panel">
        <p>Loading inventory dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="welcome-card">
        <div>
          <p className="section-label">
            TODAY'S OVERVIEW
          </p>

          <h2>
            Your stock at a glance
          </h2>

          <p>
            Keep track of what is available,
            what is running low, and what
            needs your attention.
          </p>
        </div>

        <div className="welcome-icon">
          📦
        </div>
      </div>

      <div className="stats-grid">

        <StatCard
          icon="📦"
          label="Total Products"
          value={summary.total_products}
          detail="Across your inventory"
        />

        <StatCard
          icon="⚠️"
          label="Low Stock"
          value={summary.low_stock}
          detail="Needs attention"
          warning={summary.low_stock > 0}
        />

        <StatCard
          icon="✓"
          label="Healthy Stock"
          value={summary.healthy_stock}
          detail="Above minimum"
        />

        <StatCard
          icon="🎤"
          label="Voice Ready"
          value="YES"
          detail="Speak to update stock"
        />

      </div>

      <div className="dashboard-grid">

        <div className="panel">

          <div className="panel-header">

            <div>
              <p className="section-label">
                INVENTORY
              </p>

              <h3>
                Stock Overview
              </h3>
            </div>

          </div>

          {products.length === 0 ? (

            <div className="empty-state">
              <div style={{ fontSize: "40px" }}>
                📦
              </div>

              <h3>
                No products yet
              </h3>

              <p>
                Add products to see your
                inventory here.
              </p>
            </div>

          ) : (

            products
              .slice(0, 6)
              .map((product) => (

                <ProductRow
                  key={product.id}
                  name={product.name}
                  category={getCategory(product)}
                  quantity={product.current_stock}
                  unit={product.unit}
                  status={getStatus(product)}
                />

              ))

          )}

        </div>


        <div className="panel">

          <div className="panel-header">

            <div>
              <p className="section-label">
                QUICK ACTION
              </p>

              <h3>
                What would you like to do?
              </h3>
            </div>

          </div>


          <button
            className="quick-action voice"
            onClick={() => onNavigate("voice")}
          >
            <span>🎤</span>

            <div>
              <strong>
                Update by Voice
              </strong>

              <small>
                Say what came in or went out
              </small>
            </div>
          </button>


          <button
            className="quick-action"
            onClick={() => onNavigate("products")}
          >
            <span>＋</span>

            <div>
              <strong>
                Add Product
              </strong>

              <small>
                Add a new item to inventory
              </small>
            </div>
          </button>


          <button
            className="quick-action"
            onClick={() => onNavigate("alerts")}
          >
            <span>⚠</span>

            <div>
              <strong>
                Check Low Stock
              </strong>

              <small>
                See what needs to be reordered
              </small>
            </div>
          </button>

        </div>

      </div>
    </>
  );
}


function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    unit: "pieces",
    current_stock: 0,
    minimum_stock: 5,
  });

  const loadProducts = () => {
    setLoading(true);

    fetch("http://127.0.0.1:8000/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load inventory.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "current_stock" || name === "minimum_stock"
          ? Number(value)
          : value,
    }));
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      await response.json();

      setFormData({
        name: "",
        unit: "pieces",
        current_stock: 0,
        minimum_stock: 5,
      });

      setShowForm(false);

      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Could not add the product. Please try again.");
    }
  };
const filteredProducts = products.filter((product) =>
  product.name?.toLowerCase().includes(searchTerm.toLowerCase())
);
  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="section-label">INVENTORY</p>
          <h2>Products</h2>
          <p>Manage your products and current stock.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          ＋ Add Product
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="product-form-card">

            <div className="form-header">
              <div>
                <p className="section-label">NEW INVENTORY ITEM</p>
                <h3>Add Product</h3>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddProduct}>

              <label>
                Product Name
                <input
                  type="text"
                  name="name"
                  placeholder="Example: Rice"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>

              <label>
                Unit
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="bags">Bags</option>
                  <option value="cartons">Cartons</option>
                  <option value="boxes">Boxes</option>
                  <option value="dozens">Dozens</option>
                  <option value="litres">Litres</option>
                  <option value="quintals">Quintals</option>
                </select>
              </label>

              <div className="form-two-columns">

                <label>
                  Current Stock
                  <input
                    type="number"
                    min="0"
                    name="current_stock"
                    value={formData.current_stock}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Minimum Stock
                  <input
                    type="number"
                    min="0"
                    name="minimum_stock"
                    value={formData.minimum_stock}
                    onChange={handleChange}
                  />
                </label>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Add Product
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      <div className="search-bar">
  🔍
  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

      {loading && (
        <div className="panel">
          <p>Loading inventory...</p>
        </div>
      )}

      {error && (
        <div className="panel">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="panel empty-state">
          <div style={{ fontSize: "40px" }}>📦</div>
          <h3>No products yet</h3>
          <p>
            Add your first product to start managing inventory.
          </p>
        </div>
      )}

      {!loading &&
  !error &&
  filteredProducts.length > 0 && (
    <div className="product-grid">
      {filteredProducts.map((product) => {
        const status =
          product.current_stock <= product.minimum_stock
            ? "critical"
            : product.current_stock <=
              product.minimum_stock * 1.5
            ? "low"
            : "healthy";

        return (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            quantity={product.current_stock}
            unit={product.unit}
            minimum={product.minimum_stock}
            status={status}
          />
        );
      })}
    </div>
  )}

{!loading &&
  !error &&
  products.length > 0 &&
  filteredProducts.length === 0 && (
    <div className="panel empty-state">
      <div style={{ fontSize: "40px" }}>🔍</div>

      <h3>No Products Found</h3>

      <p>
        No products match "{searchTerm}".
      </p>
    </div>
  )}
      </div>
  );
}


function VoiceStock() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [action, setAction] = useState("IN");
  const [unit, setUnit] = useState("");
  const [language, setLanguage] = useState("en-IN");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);
    setMessage("");

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setTranscript(text);
      processVoiceCommand(text);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setMessage("I could not understand the voice. Please try again.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const processVoiceCommand = (text) => {
    const lowerText = text.toLowerCase();

    let foundProduct = null;

    for (const product of products) {
      if (lowerText.includes(product.name.toLowerCase())) {
        foundProduct = product;
        break;
      }
    }

    if (!foundProduct) {
      setMessage(
        "Product not recognized. Please say the product name clearly."
      );
      return;
    }

    const numberMatch = lowerText.match(
      /\d+(?:\.\d+)?/
    );

    if (!numberMatch) {
      setMessage(
        "Quantity not recognized. Please say a number."
      );
      return;
    }

    const detectedQuantity = Number(numberMatch[0]);

    const detectedUnit =
      lowerText.includes("bag")
        ? "bags"
        : lowerText.includes("kg")
        ? "kg"
        : lowerText.includes("kilo")
        ? "kg"
        : lowerText.includes("carton")
        ? "cartons"
        : lowerText.includes("box")
        ? "boxes"
        : lowerText.includes("dozen")
        ? "dozens"
        : lowerText.includes("litre") ||
          lowerText.includes("liter")
        ? "litres"
        : foundProduct.unit;

    const stockOutWords = [
      "out",
      "sold",
      "sell",
      "sold out",
      "removed",
      "remove",
      "went out",
      "gave"
    ];

    const isStockOut = stockOutWords.some(
      (word) => lowerText.includes(word)
    );

    setSelectedProduct(foundProduct);
    setQuantity(detectedQuantity);
    setUnit(detectedUnit);
    setAction(isStockOut ? "OUT" : "IN");
    setMessage("Command understood. Please confirm.");
  };

  const confirmStockUpdate = async () => {
    if (!selectedProduct || !quantity) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${selectedProduct.id}/stock?action=${action}&quantity=${quantity}`,
        {
          method: "POST"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Stock update failed.");
        return;
      }

      setMessage(
        `Success! ${selectedProduct.name} now has ${data.current_stock} ${data.unit}.`
      );

      setProducts((previous) =>
        previous.map((product) =>
          product.id === selectedProduct.id
            ? {
                ...product,
                current_stock: data.current_stock
              }
            : product
        )
      );

      setSelectedProduct(null);
      setTranscript("");
      setQuantity("");
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to the inventory server.");
    }
  };

  const cancelCommand = () => {
    setSelectedProduct(null);
    setTranscript("");
    setQuantity("");
    setMessage("");
  };

  return (
    <div className="voice-page">

      <div className="page-heading">
        <div>
          <p className="section-label">VOICE INVENTORY</p>

          <h2>Speak to Stock 🎤</h2>

          <p>
            Update your inventory naturally without typing.
          </p>
        </div>
      </div>

      <div className="voice-card">
        <div className="language-selector">
  <label>🌐 Speak in your preferred language</label>

  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
  >
    <option value="en-IN">English</option>
    <option value="te-IN">తెలుగు (Telugu)</option>
    <option value="hi-IN">हिन्दी (Hindi)</option>
    <option value="ta-IN">தமிழ் (Tamil)</option>
    <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
  </select>
</div>

        <div className="voice-icon">
          🎤
        </div>

        <h2>
          {listening
            ? "Listening..."
            : "Tell me what happened"}
        </h2>

        <p>
          Try saying:
        </p>

        <div className="voice-example">
          “Rice 5 bags came”
        </div>

        <div className="voice-example">
          “Sugar 2 kg sold”
        </div>

        <button
          className={`voice-main-button ${
            listening ? "listening" : ""
          }`}
          onClick={startListening}
          disabled={listening}
        >
          {listening
            ? "🎙️ Listening..."
            : "🎤 Start Speaking"}
        </button>

        {transcript && (
          <div className="voice-result">

            <p className="result-label">
              I heard
            </p>

            <h3>
              "{transcript}"
            </h3>

          </div>
        )}

        {selectedProduct && (
          <div className="voice-confirm">

            <p className="result-label">
              CONFIRM STOCK UPDATE
            </p>

            <div className="confirmation-row">
              <span>Product</span>
              <strong>{selectedProduct.name}</strong>
            </div>

            <div className="confirmation-row">
              <span>Action</span>
              <strong>
                {action === "IN"
                  ? "Stock In"
                  : "Stock Out"}
              </strong>
            </div>

            <div className="confirmation-row">
              <span>Quantity</span>
              <strong>
                {quantity} {unit}
              </strong>
            </div>

            <div className="confirmation-actions">

              <button
                className="cancel-button"
                onClick={cancelCommand}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={confirmStockUpdate}
              >
                ✓ Confirm Update
              </button>

            </div>

          </div>
        )}

        {message && !selectedProduct && (
          <div className="voice-message">
            {message}
          </div>
        )}

      </div>
    </div>
  );
}


function Alerts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/products"
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        const lowStockProducts = data.filter(
          (product) =>
            product.current_stock <= product.minimum_stock
        );

        setProducts(lowStockProducts);
      } catch (error) {
        console.error("Alerts loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="section-label">ATTENTION NEEDED</p>

          <h2>Stock Alerts</h2>

          <p>
            Products that may need replenishment.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="panel">
          <p>Checking inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="panel empty-state">
          <div style={{ fontSize: "40px" }}>✅</div>

          <h3>No Low Stock Products</h3>

          <p>
            All your products currently have sufficient stock.
          </p>
        </div>
      ) : (
        <div className="alert-list">
          {products.map((product) => (
            <div
              className="alert-card critical"
              key={product.id}
            >
              <div className="alert-icon">🔴</div>

              <div>
                <h3>{product.name}</h3>

                <p>
                  Only{" "}
                  <strong>
                    {product.current_stock} {product.unit}
                  </strong>{" "}
                  remaining.
                  <br />
                  Minimum is{" "}
                  <strong>
                    {product.minimum_stock} {product.unit}
                  </strong>
                  .
                </p>
              </div>

              <button
                onClick={() =>
                  alert(
                    `Please reorder ${product.name}.`
                  )
                }
              >
                Reorder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/products/transactions/all"
        );

        if (!response.ok) {
          throw new Error("Failed to load transaction history");
        }

        const data = await response.json();

        setTransactions(data);
      } catch (error) {
        console.error("History loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="section-label">ACTIVITY</p>

          <h2>Stock History</h2>

          <p>
            Recent inventory movements.
          </p>
        </div>
      </div>

      <div className="panel history-panel">
        {loading ? (
          <div className="empty-state">
            <p>Loading transaction history...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: "40px" }}>
              📜
            </div>

            <h3>No Transactions Yet</h3>

            <p>
              Stock movements will appear here.
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <HistoryItem
              key={transaction.id}
              type={
                transaction.action === "IN"
                  ? "in"
                  : "out"
              }
              product={
                transaction.product_name ||
                `Product #${transaction.product_id}`
              }
              amount={
                transaction.action === "IN"
                  ? `+${transaction.quantity} ${transaction.unit}`
                  : `-${transaction.quantity} ${transaction.unit}`
              }
              time={formatTime(transaction.created_at)}
            />
          ))
        )}
      </div>
    </div>
  );
}


function StatCard({ icon, label, value, detail, warning }) {
  return (
    <div className={`stat-card ${warning ? "warning" : ""}`}>
      <div className="stat-icon">{icon}</div>
      <p>{label}</p>
      <h3>{value}</h3>
      <small>{detail}</small>
    </div>
  );
}


function ProductRow({ name, category, quantity, unit, status }) {
  return (
    <div className="product-row">
      <div className="product-info">
        <div className="product-avatar">
          {name.charAt(0)}
        </div>

        <div>
          <strong>{name}</strong>
          <small>{category}</small>
        </div>
      </div>

      <div className="stock-quantity">
        <strong>{quantity}</strong>
        <span>{unit}</span>
      </div>

      <span className={`status ${status}`}>
        {status === "healthy" && "Healthy"}
        {status === "low" && "Low Stock"}
        {status === "critical" && "Critical"}
      </span>
    </div>
  );
}


function ProductCard({
  id,
  name,
  quantity,
  unit,
  minimum,
  status
}) {
  const updateStock = async (action) => {
  const input = window.prompt(
    `${action === "IN" ? "Add" : "Remove"} how many ${unit}?`
  );

  if (input === null) return;

  const amount = Number(input);

  if (!amount || amount <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/products/${id}/stock?action=${action}&quantity=${amount}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Unable to update stock.");
      return;
    }

    alert(
      `${name} updated successfully!\n\nCurrent stock: ${data.current_stock} ${data.unit}`
    );

    window.location.reload();

  } catch (error) {
    console.error(error);
    alert("Could not connect to the inventory server.");
  }
};
  return (
    <div className="product-card">
      <div className="product-card-top">
        <div className="product-avatar large">
          {name.charAt(0)}
        </div>

        <span className={`status ${status}`}>
          {status === "healthy" && "Healthy"}
          {status === "low" && "Low Stock"}
          {status === "critical" && "Critical"}
        </span>
      </div>

      <h3>{name}</h3>

      <div className="big-stock">
        {quantity}
        <span>{unit}</span>
      </div>

      <p>Minimum: {minimum} {unit}</p>

      <div className="card-actions">
        <button
  onClick={() => updateStock("OUT")}
>
  − Stock Out
</button>

<button
  onClick={() => updateStock("IN")}
>
  ＋ Stock In
</button>
      </div>
    </div>
  );
}


function HistoryItem({ type, product, amount, time }) {
  return (
    <div className="history-item">
      <div className={`history-icon ${type}`}>
        {type === "in" ? "↓" : "↑"}
      </div>

      <div>
        <strong>{product}</strong>
        <small>
          {type === "in" ? "Stock In" : "Stock Out"}
        </small>
      </div>

      <strong className={type === "in" ? "positive" : "negative"}>
        {amount}
      </strong>

      <span>{time}</span>
    </div>
  );
}

export default App;