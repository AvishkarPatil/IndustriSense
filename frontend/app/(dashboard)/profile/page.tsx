"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Building2, Shield, LogOut, Camera, Save } from "lucide-react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile/')
      const user = response.data
      const profileData = {
        name: `${user.first_name} ${user.last_name}` || user.username,
        email: user.email,
        phone: user.phone_number || 'Not set',
        location: user.factory_location || 'Not set',
        company: 'Smart Factory',
        role: user.role,
        avatar: user.profile_photo || '/professional-profile-avatar.png',
      }
      setProfile(profileData)
      setFormData(profileData)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const [firstName, ...lastNameParts] = formData.name.split(' ')
      await api.put('/auth/profile/update/', {
        first_name: firstName,
        last_name: lastNameParts.join(' '),
        email: formData.email,
        phone_number: formData.phone,
        factory_location: formData.location
      })
      setProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/')
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>
  if (!profile) return <div className="p-6 text-center">Failed to load profile</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Cover */}
          <div className="h-24 md:h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

          {/* Profile Info */}
          <div className="px-4 md:px-6 pb-6">
            <div className="flex flex-col items-center md:items-end md:flex-row md:gap-6 -mt-12 md:-mt-16 mb-6">
              {/* Avatar */}
              <div className="relative mb-4 md:mb-0">
                <div className="w-24 md:w-32 h-24 md:h-32 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
                  {profile.name?.[0] || 'U'}
                </div>
                <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                  <Camera className="w-4 md:w-5 h-4 md:h-5" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                <p className="text-gray-600 font-medium mb-2">{profile.role}</p>
                <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center md:justify-start">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Verified
                  </span>
                  <span className="text-gray-500 text-sm">{profile.company}</span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 w-full md:w-auto mt-4 md:mt-0"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* Details Grid */}
            {!isEditing ? (
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <Mail className="w-5 md:w-6 h-5 md:h-6 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900 font-medium truncate text-sm md:text-base">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <Phone className="w-5 md:w-6 h-5 md:h-6 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-gray-900 font-medium truncate text-sm md:text-base">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 md:w-6 h-5 md:h-6 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Location</p>
                    <p className="text-gray-900 font-medium truncate text-sm md:text-base">{profile.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <Building2 className="w-5 md:w-6 h-5 md:h-6 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Company</p>
                    <p className="text-gray-900 font-medium truncate text-sm md:text-base">{profile.company}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {Object.entries(formData)
                  .filter(([key]) => key !== "avatar")
                  .map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                        {key === "name" ? "Full Name" : key}
                      </label>
                      <input
                        type="text"
                        value={value as string}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Security Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Security</h3>
            </div>
            <button className="w-full px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300 text-sm md:text-base">
              Change Password
            </button>
          </div>

          {/* Sessions Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <LogOut className="w-6 h-6 text-red-600" />
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Logout</h3>
            </div>
            <button onClick={handleLogout} className="w-full px-4 py-3 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition-colors duration-300 text-sm md:text-base">
              Logout from All Devices
            </button>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300 order-2 md:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 order-1 md:order-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
