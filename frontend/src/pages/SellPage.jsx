import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function SellPage() {
  const { user, isSeller } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    condition: '',
    brand: '',
    model: '',
    year: '',
    category: '',
    image: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        condition: '',
        brand: '',
        model: '',
        year: '',
        category: '',
        image: null
      });
    }, 2000);
  };

  const conditions = [
    { value: 'NEW', label: 'New - Never Used' },
    { value: 'USED', label: 'Used - Good Condition' },
    { value: 'REFURBISHED', label: 'Refurbished - Like New' }
  ];

  const categories = [
    'Engine Parts',
    'Brake System',
    'Suspension',
    'Electrical',
    'Body Parts',
    'Interior',
    'Exhaust System',
    'Transmission',
    'Cooling System',
    'Other'
  ];

  const brands = [
    'Honda', 'Toyota', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz',
    'Audi', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'Subaru'
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)', paddingTop: '2rem' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: 'var(--gray-800)',
              marginBottom: '1rem'
            }}>
              💰 List Your Part
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <span>{user.avatar}</span>
              <span style={{ color: 'var(--gray-600)' }}>Welcome, {user.name}</span>
              <span style={{
                backgroundColor: 'var(--secondary-color)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                SELLER
              </span>
            </div>
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'var(--gray-600)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Sell your car parts to buyers who need them. Get the best price for your quality parts.
            </p>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="card" style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              color: '#166534',
              marginBottom: '2rem',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Part Listed Successfully!</h3>
              <p style={{ margin: 0 }}>Your part has been listed and is now visible to buyers.</p>
            </div>
          )}

          {/* Form */}
          <div className="card">
            <div style={{ padding: '2rem' }}>
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ 
                    marginBottom: '1rem', 
                    color: 'var(--gray-800)',
                    fontSize: '1.25rem',
                    fontWeight: '600'
                  }}>
                    Basic Information
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--gray-700)',
                        marginBottom: '0.5rem'
                      }}>
                        Part Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., Honda Civic Brake Pads"
                        required
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--gray-700)',
                        marginBottom: '0.5rem'
                      }}>
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-input"
                        rows="4"
                        placeholder="Describe the part, its condition, and any relevant details..."
                        required
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: 'var(--gray-700)',
                          marginBottom: '0.5rem'
                        }}>
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: 'var(--gray-700)',
                          marginBottom: '0.5rem'
                        }}>
                          Condition *
                        </label>
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          <option value="">Select condition</option>
                          {conditions.map(condition => (
                            <option key={condition.value} value={condition.value}>
                              {condition.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ 
                    marginBottom: '1rem', 
                    color: 'var(--gray-800)',
                    fontSize: '1.25rem',
                    fontWeight: '600'
                  }}>
                    Vehicle Information
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--gray-700)',
                        marginBottom: '0.5rem'
                      }}>
                        Brand *
                      </label>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="">Select brand</option>
                        {brands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--gray-700)',
                        marginBottom: '0.5rem'
                      }}>
                        Model *
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., Civic"
                        required
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--gray-700)',
                        marginBottom: '0.5rem'
                      }}>
                        Year *
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="2020"
                        min="1990"
                        max="2025"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--gray-700)',
                      marginBottom: '0.5rem'
                    }}>
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ 
                    marginBottom: '1rem', 
                    color: 'var(--gray-800)',
                    fontSize: '1.25rem',
                    fontWeight: '600'
                  }}>
                    Part Image
                  </h3>
                  
                  <div style={{
                    border: '2px dashed var(--gray-300)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--gray-50)',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📷</div>
                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--gray-700)' }}>
                      Upload Part Image
                    </h4>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>
                      High-quality images help sell your parts faster
                    </p>
                    <input
                      type="file"
                      name="image"
                      onChange={handleInputChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="btn btn-outline">
                      Choose Image
                    </label>
                    {formData.image && (
                      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        Selected: {formData.image.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                    style={{
                      minWidth: '150px',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span>🔄</span>
                        <span>Listing...</span>
                      </>
                    ) : (
                      <>
                        <span>💰</span>
                        <span>List Part</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tips */}
          <div className="card" style={{ marginTop: '2rem', backgroundColor: 'var(--gray-50)' }}>
            <div style={{ padding: '1.5rem' }}>
              <h4 style={{ 
                marginBottom: '1rem', 
                color: 'var(--gray-800)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                💡 Selling Tips
              </h4>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '1.5rem',
                color: 'var(--gray-600)',
                lineHeight: '1.6'
              }}>
                <li>Take clear, well-lit photos from multiple angles</li>
                <li>Be honest about the condition and any defects</li>
                <li>Research similar parts to price competitively</li>
                <li>Include detailed descriptions with part numbers if available</li>
                <li>Respond quickly to buyer inquiries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellPage;
