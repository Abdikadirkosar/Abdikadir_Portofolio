import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Image, Link, Check, Save } from "lucide-react";
import { safeQuery, uploadFile } from "../../../lib/supabase";
import { toast } from "react-toastify";

const ProfileTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    email: "",
    phone: "",
    avatar: "",
    github: "",
    linkedin: "",
    twitter: ""
  });

  const handleFileUpload = async (e, fieldName, folder) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const publicUrl = await uploadFile(file, folder);
      setProfile(prev => ({ ...prev, [fieldName]: publicUrl }));
      toast.update(toastId, {
        render: "File uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: `Upload failed: ${err.message || err}`,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data } = await safeQuery(sb => sb.from("db_profile").select("*").eq("id", 1).single());
      if (data) {
        setProfile(prev => ({ ...prev, ...data }));
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await safeQuery(sb =>
      sb.from("db_profile").upsert({ id: 1, ...profile }).eq("id", 1)
    );

    setSaving(false);
    if (!error) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-6 h-6 border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Profile Management</h1>
          <p className="text-white/40 text-xs mt-0.5">Edit portfolio bio, social links, location, and CV URL.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Image Previews */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-4">
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">AVATAR</p>
            
            {/* Avatar URL input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Profile Picture</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="avatar" 
                  value={profile.avatar || ""} 
                  onChange={handleChange}
                  placeholder="Paste image URL..."
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 transition-all"
                />
                <label className="px-3 py-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-[10px] uppercase font-mono tracking-wider cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-center flex-shrink-0">
                  Upload
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, "avatar", "profile")} 
                  />
                </label>
              </div>
              {profile.avatar && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 mt-1">
                  <img src={profile.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mid & Right Columns - Fields Form */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-4">
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest font-bold">INFO & DETAILS</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={profile.name || ""} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Job Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={profile.title || ""} 
                  onChange={handleChange} 
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Bio / Short Description</label>
              <textarea 
                name="bio" 
                rows="3"
                value={profile.bio || ""} 
                onChange={handleChange} 
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={profile.location || ""} 
                  onChange={handleChange} 
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={profile.email || ""} 
                  onChange={handleChange} 
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={profile.phone || ""} 
                  onChange={handleChange} 
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/[0.06] pt-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">GitHub URL</label>
                <input 
                  type="text" 
                  name="github" 
                  value={profile.github || ""} 
                  onChange={handleChange} 
                  placeholder="https://github.com/..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">LinkedIn URL</label>
                <input 
                  type="text" 
                  name="linkedin" 
                  value={profile.linkedin || ""} 
                  onChange={handleChange} 
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Twitter / X URL</label>
                <input 
                  type="text" 
                  name="twitter" 
                  value={profile.twitter || ""} 
                  onChange={handleChange} 
                  placeholder="https://twitter.com/..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 hover:border-[#4FFFB0]/40 transition-all cursor-pointer"
              >
                <Save size={13} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

      </form>
      
    </div>
  );
};

export default ProfileTab;
