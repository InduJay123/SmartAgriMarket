import { useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import avatar from '../../assets/avatar.avif';
import { deleteFarmerProfileImage, updateFarmerProfile } from '../../api/farmer/farmerProfile';
import { supabase } from '../../lib/supabase';

interface ProfileImageUploadProps {
  image?: string; 
  onChange: (url: string) => void; 
}

const FarmerProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ image, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(image || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    setUploading(true);
    setError('');

    try {
      const fileName = `${Date.now()}_${file.name}`;

      const { data, error } = await supabase.storage
        .from('profile_image')
        .upload(`farmer_images/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicData, error: urlError } = supabase.storage
        .from('profile_image')
        .getPublicUrl(`farmer_images/${fileName}`);

      if (urlError) throw urlError;
      if (!publicData?.publicUrl) throw new Error('Failed to get public URL');

      const publicUrl = publicData.publicUrl;

      setPreview(publicUrl); // update local preview
      onChange(publicUrl);   // update parent

      await updateFarmerProfile(1, { profile_image: publicUrl });
    } catch (err: any) {
        console.error('Image upload failed:', err);
        setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      if (preview) {
        const path = preview.split('/profile_image/')[1];
        if (path) {
          await supabase.storage.from('profile_image').remove([path]);
        }
      }
      await deleteFarmerProfileImage(1);

      setPreview('');
      onChange('');

    } catch (err) {
      console.error('Failed to remove profile image:', err);
      setError('Failed to remove image');
    }
  };

  return (
    <div className="relative w-24 h-24 group">
      {/* Profile image or default avatar */}
      <img
        src={preview || avatar}
        alt="Profile"
        className="w-24 h-24 object-cover rounded-full border border-gray-300"
      />

      {/* Edit overlay on hover */}
      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition">
        <label className="cursor-pointer text-white">
          {uploading ? 'Uploading...' : <Camera size={20} />}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-white hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FarmerProfileImageUpload;