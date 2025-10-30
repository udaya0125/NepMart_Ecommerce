import { X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

const EditUserForm = ({ 
  editingUser, 
  onCancel, 
  onSubmit, 
  submitting,
  currentUser 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "customer",
      image: null,
    }
  });

  // Check if current user is super admin
  const isSuperAdmin = currentUser?.role === 'super admin';

  // Reset form when editingUser changes
  React.useEffect(() => {
    if (editingUser) {
      setValue("name", editingUser.name);
      setValue("email", editingUser.email);
      setValue("role", editingUser.role);
      setValue("image", null);
    } else {
      reset();
    }
  }, [editingUser, reset, setValue]);

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    
    // Only append the role field since that's the only editable field
    formData.append("role", data.role);

    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Edit User Role
          </h1>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name Field - Readonly */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={editingUser?.name || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Email Field - Readonly */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editingUser?.email || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Role Field - Editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isSuperAdmin}
            >
              {isSuperAdmin && (
                <option value="super admin">Super Admin</option>
              )}
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
            {!isSuperAdmin && (
              <p className="text-xs text-gray-500 mt-1">
                Only super admins can change user roles
              </p>
            )}
          </div>

          {/* Image Field - Readonly Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed">
              {editingUser?.image ? (
                <p className="text-sm">Current image: {editingUser.image}</p>
              ) : (
                <p className="text-sm">No image</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Profile image cannot be edited here
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating Role..." : "Update Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;