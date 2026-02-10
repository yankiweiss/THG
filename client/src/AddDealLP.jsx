import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import {
  FaCloudUploadAlt,
  FaCheckCircle,
} from "react-icons/fa";
import "./index.css";

function AddDealLP() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // need to look into below if needed.
  const [investors, setInvestors] = useState([]);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(investors)

    const form = e.target;
    const picFile = form.querySelector('[name="pictures"]').files[0];

    const uploadToCloudinary = async (file) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "thehamiltongroup");

      setUploadProgress(30);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dhwtnj8eb/image/upload`,
        {
          method: "POST",
          body: fd,
        },
      );

      setUploadProgress(70);
      const data = await res.json();
      setUploadProgress(100);
      return data.secure_url;
    };

    let uploadedPicUrl = "";
    if (picFile) {
      uploadedPicUrl = await uploadToCloudinary(picFile);
    }

    if (!uploadedPicUrl) {
      alert("Image upload failed");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());

    const payload = {
      ...dataObject,
      pictures: uploadedPicUrl,
      investors: investors,
    };

    console.log(payload);

    await fetch("https://thg-seven.vercel.app/api/properties/addDeal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);
    // You can add success notification or redirect here
  };

  return (
    <>
      <style>{`
        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          --danger-gradient: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
          --border-radius: 16px;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
          --shadow-lg: 0 12px 32px rgba(0,0,0,0.16);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .page-container {
          background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
          min-height: 100vh;
          padding: 2rem 0 4rem;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .main-title {
          font-size: 2.75rem;
          font-weight: 800;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          letter-spacing: -0.5px;
        }

        .subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .deal-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
          margin-bottom: 2.5rem;
        }

        .form-card {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          border: none;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .form-section {
          padding: 2.5rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .section-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--primary-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .section-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .form-label-modern {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.9375rem;
          display: block;
        }

        .form-control-modern {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: var(--transition);
          background: white;
        }

        .form-control-modern:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
          outline: none;
        }

        .form-control-modern::placeholder {
          color: #9ca3af;
        }

        .helper-text {
          font-size: 0.8125rem;
          color: #6b7280;
          margin-top: 0.375rem;
          display: block;
        }

        .file-upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: var(--transition);
          cursor: pointer;
          background: #f9fafb;
          position: relative;
          overflow: hidden;
        }

        .file-upload-area:hover {
          border-color: #8b5cf6;
          background: #faf5ff;
        }

        .file-upload-area.has-file {
          border-color: #10b981;
          background: #ecfdf5;
        }

        .upload-icon {
          font-size: 3rem;
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        .file-upload-area:hover .upload-icon {
          color: #8b5cf6;
        }

        .file-upload-area.has-file .upload-icon {
          color: #10b981;
        }

        .upload-text {
          color: #374151;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .upload-subtext {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .image-preview {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-top: 1rem;
          box-shadow: var(--shadow-sm);
        }

        .progress-bar-container {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 1rem;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--success-gradient);
          transition: width 0.3s ease;
        }

        .investor-item {
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: var(--transition);
          position: relative;
        }

        .investor-item:hover {
          border-color: #c4b5fd;
          box-shadow: var(--shadow-sm);
        }

        .investor-number {
          position: absolute;
          top: -12px;
          left: 1.5rem;
          background: var(--primary-gradient);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          box-shadow: var(--shadow-sm);
        }

        .remove-investor-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: white;
          border: 2px solid #fee2e2;
          color: #ef4444;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .remove-investor-btn:hover {
          background: #fef2f2;
          border-color: #ef4444;
          transform: scale(1.1);
        }

        .add-investor-btn {
          background: white;
          border: 2px dashed #8b5cf6;
          color: #8b5cf6;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          transition: var(--transition);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .add-investor-btn:hover {
          background: #faf5ff;
          border-color: #7c3aed;
          color: #7c3aed;
          transform: translateY(-2px);
        }

        .submit-section {
          padding: 2.5rem;
          text-align: center;
          background: linear-gradient(to bottom, transparent 0%, #f9fafb 100%);
        }

        .submit-btn {
          background: var(--primary-gradient);
          border: none;
          color: white;
          padding: 1rem 3rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.125rem;
          transition: var(--transition);
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .submit-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .input-group-modern {
          position: relative;
        }

        .input-prefix {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-weight: 600;
          z-index: 10;
        }

        .form-control-modern.with-prefix {
          padding-left: 2.5rem;
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 2rem;
          }

          .form-section {
            padding: 1.5rem;
          }

          .investor-number {
            top: -10px;
            left: 1rem;
            width: 28px;
            height: 28px;
            font-size: 0.75rem;
          }

          .remove-investor-btn {
            top: 0.75rem;
            right: 0.75rem;
          }
        }

        .success-checkmark {
          color: #10b981;
          font-size: 1.25rem;
          margin-left: 0.5rem;
          animation: scaleIn 0.3s ease;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>

      <div className="page-container">
        <div className="container" style={{ maxWidth: "1000px" }}>
          {/* HEADER */}
          <div className="header-section">
            <h1 className="main-title">Create New Property</h1>
            <p className="subtitle">
              Set up your property details to start tracking investors and
              returns with comprehensive portfolio management
            </p>
            <div className="mt-4">
              <span className="deal-type-badge">
                <FaCheckCircle />
                Limited Partner Deal
              </span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleForm}>
            <div className="form-card">
              {/* PROPERTY INFORMATION */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">🏢</div>
                  <div>
                    <h3 className="section-title">Property Information</h3>
                    <p className="section-subtitle">
                      Essential details about the property asset
                    </p>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label-modern">Property Name *</label>
                    <input
                      className="form-control form-control-modern"
                      name="property_name"
                      placeholder="e.g., 18 Pulaski St LLC"
                      required
                    />
                    <small className="helper-text">
                      Internal name or legal entity identifier
                    </small>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label-modern">
                      Purchase Price *
                    </label>
                    <div className="input-group-modern">
                      <span className="input-prefix">$</span>
                      <input
                        className="form-control form-control-modern with-prefix"
                        name="purchase_price"
                        placeholder="1,000,000"
                        type="number"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label-modern">Closing Date *</label>
                    <input
                      type="date"
                      className="form-control form-control-modern"
                      name="closing_date"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* DOCUMENTS & MEDIA */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">📁</div>
                  <div>
                    <h3 className="section-title">Documents & Media</h3>
                    <p className="section-subtitle">
                      Upload property images and related documents
                    </p>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label-modern">
                      Property Documents
                    </label>
                    <label className="file-upload-area">
                      <FaCloudUploadAlt className="upload-icon" />
                      <div className="upload-text">
                        Click to upload documents
                      </div>
                      <div className="upload-subtext">
                        Operating agreement, PPM, contracts
                      </div>
                      <input
                        type="file"
                        className="d-none"
                        multiple
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-modern">
                      Property Images *
                    </label>
                    <label
                      className={`file-upload-area ${previewImage ? "has-file" : ""}`}
                    >
                      {previewImage ? (
                        <FaCheckCircle className="upload-icon" />
                      ) : (
                        <FaCloudUploadAlt className="upload-icon" />
                      )}
                      <div className="upload-text">
                        {previewImage
                          ? "Image uploaded successfully!"
                          : "Click to upload image"}
                      </div>
                      <div className="upload-subtext">
                        Used for property overview
                      </div>
                      <input
                        type="file"
                        className="d-none"
                        name="pictures"
                        onChange={handleImagePreview}
                        accept="image/*"
                        required
                      />
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="image-preview"
                        />
                      )}
                    </label>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* INVESTORS SECTION */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">👥</div>
                  <div>
                    <h3 className="section-title">Investor Details</h3>
                    <p className="section-subtitle">
                      Add investor and contribution details
                    </p>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-modern">Investor Name *</label>
                    <input
                      className="form-control form-control-modern"
                      placeholder="e.g., John Smith"
                      onChange={(e) => setInvestors({...investors, 'investor_name': e.target.value})}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label-modern">
                      Amount Invested *
                    </label>
                    <div className="input-group-modern">
                      <span className="input-prefix">$</span>
                      <input
                        className="form-control form-control-modern with-prefix"
                        placeholder="100,000"
                        type="number"
                        onChange={(e) => setInvestors({...investors, 'invested_amount' : e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label-modern">
                      Preferred Return *
                    </label>
                    <div className="input-group-modern">
                      <input
                        className="form-control form-control-modern"
                        placeholder="8"
                        type="number"
                        step="0.1"
                        onChange={(e) => setInvestors({...investors, 'pref_return' : e.target.value})}
                        required
                      />
                      <span
                        className="input-prefix"
                        style={{ left: "auto", right: "1rem" }}
                      >
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMIT SECTION */}
              <div className="submit-section">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <span className="spinner" />}
                  {isSubmitting ? "Creating Property..." : "Create Property"}
                </button>
                {!isSubmitting && (
                  <div className="mt-3">
                    <small className="helper-text">
                      All required fields must be filled before submitting
                    </small>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddDealLP;
