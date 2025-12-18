import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Plus, Edit, Trash2, Search, Image as ImageIcon, Save, X, Loader2,
  CheckCircle, XCircle, UploadCloud, Eye, EyeOff
} from "lucide-react";

// --- CONFIG ---
const API_URL = "http://localhost:5000/api/banners";
const CLOUD_NAME = "detransaw";     
const UPLOAD_PRESET = "web_upload"; 

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- IMAGE STATE ---
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  // --- FORM STATE ---
  const initialFormState = {
    title: "",
    subtitle: "",
    link_to: "",
    image_url: "",
    order: 0,
    is_active: true
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- FETCH DATA ---
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/all`, { withCredentials: true });
      setBanners(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // --- CLOUDINARY UPLOAD ---
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // --- HANDLERS ---
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview("");
    setFormData(prev => ({ ...prev, image_url: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setSelectedImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingId(banner._id);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      link_to: banner.link_to || "",
      image_url: banner.image_url || "",
      order: banner.order || 0,
      is_active: banner.is_active
    });
    setImagePreview(banner.image_url || "");
    setSelectedImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.image_url;

      if (selectedImageFile) {
        finalImageUrl = await uploadToCloudinary(selectedImageFile);
      }

      if (!finalImageUrl) {
        alert("Please upload an image for the banner.");
        setIsSubmitting(false);
        return;
      }

      const payload = { ...formData, image_url: finalImageUrl };
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      await axios({
        method,
        url,
        data: payload,
        withCredentials: true
      });

      alert(editingId ? "Banner updated!" : "Banner created!");
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      setBanners(prev => prev.filter(b => b._id !== id));
    } catch (error) {
      alert("Failed to delete banner.");
    }
  };

  const toggleActiveStatus = async (banner) => {
    try {
      await axios.put(`${API_URL}/${banner._id}`, { is_active: !banner.is_active }, { withCredentials: true });
      setBanners(prev => prev.map(b => b._id === banner._id ? { ...b, is_active: !b.is_active } : b));
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <ImageIcon className="text-blue-600" /> Quản lý Banner
          </h2>
          <p className="text-gray-500 text-sm mt-1">Total: {banners.length} banners</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg transition-all">
          <Plus size={18} /> Thêm Banner
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold">
              <tr>
                <th className="py-4 px-6 w-32">Image</th>
                <th className="py-4 px-6">Title / Subtitle</th>
                <th className="py-4 px-6">Link</th>
                <th className="py-4 px-6 text-center">Order</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-600">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center"><Loader2 className="animate-spin inline text-blue-600"/> Loading...</td></tr>
              ) : banners.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center">No banners found.</td></tr>
              ) : (
                banners.map(banner => (
                  <tr key={banner._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-24 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{banner.title || "---"}</div>
                      <div className="text-xs text-gray-500">{banner.subtitle}</div>
                    </td>
                    <td className="py-4 px-6 text-blue-600 truncate max-w-xs">{banner.link_to || "---"}</td>
                    <td className="py-4 px-6 text-center font-semibold">{banner.order}</td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => toggleActiveStatus(banner)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${banner.is_active ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'}`}
                      >
                        {banner.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {banner.is_active ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(banner)} className="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-200 shadow-sm transition-all"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(banner._id)} className="p-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-200 shadow-sm transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
              <h3 className="text-xl font-bold text-gray-800">{editingId ? "Edit Banner" : "New Banner"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Image *</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageFileChange} className="hidden" />
                
                {imagePreview ? (
                  <div className="relative w-full h-48 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => fileInputRef.current.click()} className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md">Change</button>
                      <button type="button" onClick={handleRemoveImage} className="bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current.click()} className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all">
                    <UploadCloud className="text-gray-400 mb-1" />
                    <span className="text-sm font-medium text-gray-600">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1">Recommended: 1200x600px</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                  <input name="title" value={formData.title} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Big Sale..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subtitle (Optional)</label>
                  <input name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Up to 50% off" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link To (Optional)</label>
                  <input name="link_to" value={formData.link_to} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="/products/..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Order</label>
                  <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                    <span className="text-sm font-medium text-gray-700">Active (Visible)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium flex items-center gap-2 shadow-lg transition-all disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;