import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import FallbackImage from "../../components/FallbackImage/FallbackImage";
import styles from "./EditProfile.module.scss";
import {
  useGetOneProfileToEditQuery,
  useUpdateProfileMutation,
} from "@/features/profileApi";
import { useCurrentUser } from "@/utils/useCurrentUser";
import { Loading } from "@/components";
import * as yup from "yup";
import profileSchema from "@/schemas/profileShema";

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    role: "",
    introduction: "",
    address: "",
    website: "",
    avatar: "",
    coverImage: "",
    socials: {
      twitter: "",
      github: "",
      linkedin: "",
    },
    skills: "",
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showFollowersCount: true,
      showFollowingCount: true,
      allowDirectMessages: true,
      showOnlineStatus: true,
    },
  });
  const [editProfile] = useUpdateProfileMutation();
  const [imageFiles, setImageFiles] = useState({
    avatar: null,
    coverImage: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    avatar: null,
    coverImage: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const currentUser = useCurrentUser();

  const {
    data: { user: profile } = {},
    isLoading: isLoadingProfile,
    error: errorProfile,
    isSuccess: isSuccessProfile,
  } = useGetOneProfileToEditQuery(
    { username: currentUser.username },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  useEffect(() => {
    if (!profile) return;
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      username: profile?.username || "",
      role: profile?.role || "",
      introduction: profile?.introduction || "",
      address: profile?.address || "",
      website: profile?.website || "",
      avatar: profile?.avatar || "",
      coverImage: profile?.coverImage || "",
      socials: {
        twitter: profile?.socials?.twitter || "",
        github: profile?.socials?.github || "",
        linkedin: profile?.socials?.linkedin || "",
      },
      skills: profile?.skills?.map((skill) => skill).join(", ") || "",
      privacy: { ...profile?.privacy } || {
        profileVisibility: "Public",
        showEmail: false,
        showFollowersCount: true,
        showFollowingCount: true,
        allowDirectMessages: true,
        showOnlineStatus: true,
      },
    });
    setImagePreviews({
      avatar: profile?.avatar,
      coverImage: profile?.coverImage,
    });
  }, [profile]);

  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  if (isLoadingProfile) {
    return (
      <div className={styles.profile}>
        <div className="container">
          <Loading size="md" text="Loading profile..." />
        </div>
      </div>
    );
  }
  if (errorProfile) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Article not found</h1>
        <p>
          The article you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }
  if (isSuccessProfile) {
    const handleInputChange = (field, value) => {
      if (field.startsWith("socials.")) {
        const socialsField = field.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          socials: {
            ...prev.socials,
            [socialsField]: value,
          },
        }));
      } else if (field.startsWith("privacy.")) {
        const privacyField = field.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          privacy: {
            ...prev.privacy,
            [privacyField]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }

      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

    const handleImageChange = (type, event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          [type]: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [type]: "Image size must be less than 5MB",
        }));
        return;
      }

      // Clear previous error
      setErrors((prev) => ({
        ...prev,
        [type]: "",
      }));

      // Store file
      setImageFiles((prev) => ({
        ...prev,
        [type]: file,
      }));

      const objectUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [type]: objectUrl,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const submitData = {
          ...formData,
          ...imageFiles,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0)
            .filter(Boolean),
        };

        const validatedData = await profileSchema.validate(submitData, {
          abortEarly: false,
        });

        if (validatedData) {
          const formDataToSend = new FormData();

          formDataToSend.append("firstName", formData.firstName);
          formDataToSend.append("lastName", formData.lastName);
          formDataToSend.append("username", formData.username);
          formDataToSend.append("role", formData.role);
          formDataToSend.append("introduction", formData.introduction);
          formDataToSend.append("address", formData.address);
          formDataToSend.append("website", formData.website);
          formDataToSend.append(
            "skills",
            JSON.stringify(
              formData.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            )
          );
          formDataToSend.append("privacy", JSON.stringify(formData.privacy));
          formDataToSend.append("socials", JSON.stringify(formData.socials));

          // Append images only if selected
          if (imageFiles.avatar) {
            formDataToSend.append("avatar", imageFiles.avatar);
          }
          if (imageFiles.coverImage) {
            formDataToSend.append("coverImage", imageFiles.coverImage);
          }

          await editProfile({
            id: currentUser.id,
            data: formDataToSend,
          });
          navigate(`/profile/${formData.username}/edit`, {
            state: { message: "Profile updated successfully!" },
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          err.inner.forEach((error) => {
            setErrors((prev) => ({
              ...prev,
              [error.path]: error.message,
            }));
          });
        }
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      navigate(-1); // Go back to previous page
    };

    return (
      <div className={styles.editProfilePage}>
        <div className="container">
          <div className={styles.pageHeader}>
            <Button
              variant="ghost"
              onClick={handleCancel}
              className={styles.backButton}
            >
              ← Back
            </Button>
            <h1>Edit Profile</h1>
            {location.state?.message ? (
              <p className={styles.editSuccess}>{location.state.message}</p>
            ) : (
              <p>Update your profile information and settings</p>
            )}
          </div>

          <Card className={styles.formCard}>
            <form
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className={styles.form}
            >
              {/* Profile Images */}
              <div className={styles.section}>
                <h3>Profile Images</h3>
                <div className={styles.imageSection}>
                  <div className={styles.imagePreview}>
                    <div className={styles.coverPreview}>
                      <FallbackImage
                        src={imagePreviews.coverImage}
                        alt="Cover preview"
                        className={styles.coverImg}
                      />
                      <div className={styles.imageUpload}>
                        <input
                          type="file"
                          id="coverImage"
                          accept="image/*"
                          onChange={(e) => handleImageChange("coverImage", e)}
                          className={styles.fileInput}
                        />
                        <label
                          htmlFor="coverImage"
                          className={styles.uploadButton}
                        >
                          📷 Change Cover
                        </label>
                      </div>
                      <span className={styles.imageLabel}>Cover Image</span>
                      {errors.coverImage && (
                        <div className={styles.imageError}>
                          {errors.coverImage}
                        </div>
                      )}
                    </div>

                    <div className={styles.avatarPreview}>
                      <FallbackImage
                        src={imagePreviews.avatar}
                        alt="Avatar preview"
                        className={styles.avatarImg}
                      />
                      <div className={styles.imageUpload}>
                        <input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={(e) => handleImageChange("avatar", e)}
                          className={styles.fileInput}
                        />
                        <label htmlFor="avatar" className={styles.uploadButton}>
                          📷 Change
                        </label>
                      </div>
                      <span className={styles.imageLabel}>Avatar</span>
                      {errors.avatar && (
                        <div className={styles.imageError}>{errors.avatar}</div>
                      )}
                    </div>
                  </div>

                  <div className={styles.imageHints}>
                    <p>
                      <strong>Avatar:</strong> Recommended 400x400px, max 5MB
                    </p>
                    <p>
                      <strong>Cover:</strong> Recommended 1200x300px, max 5MB
                    </p>
                    <p>Supported formats: JPG, PNG, GIF</p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className={styles.section}>
                <h3>Basic Information</h3>
                <div className={styles.grid}>
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    error={errors.firstName}
                    required
                    fullWidth
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    error={errors.lastName}
                    required
                    fullWidth
                  />
                  <Input
                    label="Username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    error={errors.username}
                    required
                    fullWidth
                  />
                </div>

                <Input
                  label="Professional Title"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  fullWidth
                />

                <div className={styles.textareaContainer}>
                  <label className={styles.textareaLabel}>Bio</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.introduction}
                    onChange={(e) =>
                      handleInputChange("introduction", e.target.value)
                    }
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className={styles.section}>
                <h3>Contact Information</h3>
                <div className={styles.grid}>
                  <Input
                    label="Location"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="e.g. San Francisco, CA"
                    fullWidth
                  />
                  <Input
                    label="Website"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://yourwebsite.com"
                    error={errors.website}
                    fullWidth
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className={styles.section}>
                <h3>Social Links</h3>
                <Input
                  label="Twitter"
                  value={formData.socials.twitter}
                  onChange={(e) =>
                    handleInputChange("socials.twitter", e.target.value)
                  }
                  placeholder="https://twitter.com/username"
                  error={errors["socials.twitter"]}
                  fullWidth
                />
                <Input
                  label="GitHub"
                  value={formData.socials.github}
                  onChange={(e) =>
                    handleInputChange("socials.github", e.target.value)
                  }
                  placeholder="https://github.com/username"
                  error={errors["socials.github"]}
                  fullWidth
                />
                <Input
                  label="LinkedIn"
                  value={formData.socials.linkedin}
                  onChange={(e) =>
                    handleInputChange("socials.linkedin", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/username"
                  error={errors["socials.linkedin"]}
                  fullWidth
                />
              </div>

              {/* Skills */}
              <div className={styles.section}>
                <h3>Skills</h3>
                <Input
                  label="Skills (comma separated)"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="React, TypeScript, Node.js, GraphQL"
                  helperText="Separate skills with commas"
                  fullWidth
                />
              </div>

              {/* Privacy Settings */}
              <div className={styles.section}>
                <h3>Privacy Settings</h3>
                <div className={styles.privacyControls}>
                  <div className={styles.privacyItem}>
                    <div className={styles.privacyInfo}>
                      <label className={styles.privacyLabel}>
                        Profile Visibility
                      </label>
                      <p className={styles.privacyDescription}>
                        Control who can view your profile
                      </p>
                    </div>
                    <select
                      value={formData.privacy.profileVisibility}
                      onChange={(e) =>
                        handleInputChange(
                          "privacy.profileVisibility",
                          e.target.value
                        )
                      }
                      className={styles.privacySelect}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className={styles.privacyItem}>
                    <div className={styles.privacyInfo}>
                      <label className={styles.privacyLabel}>
                        Show Email Address
                      </label>
                      <p className={styles.privacyDescription}>
                        Display your email on your profile
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.privacy.showEmail}
                      onChange={(e) =>
                        handleInputChange("privacy.showEmail", e.target.checked)
                      }
                      className={styles.privacyToggle}
                    />
                  </div>

                  <div className={styles.privacyItem}>
                    <div className={styles.privacyInfo}>
                      <label className={styles.privacyLabel}>
                        Show Followers Count
                      </label>
                      <p className={styles.privacyDescription}>
                        Display number of followers on your profile
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.privacy.showFollowersCount}
                      onChange={(e) =>
                        handleInputChange(
                          "privacy.showFollowersCount",
                          e.target.checked
                        )
                      }
                      className={styles.privacyToggle}
                    />
                  </div>

                  <div className={styles.privacyItem}>
                    <div className={styles.privacyInfo}>
                      <label className={styles.privacyLabel}>
                        Show Following Count
                      </label>
                      <p className={styles.privacyDescription}>
                        Display number of people you follow
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.privacy.showFollowingCount}
                      onChange={(e) =>
                        handleInputChange(
                          "privacy.showFollowingCount",
                          e.target.checked
                        )
                      }
                      className={styles.privacyToggle}
                    />
                  </div>

                  <div className={styles.privacyItem}>
                    <div className={styles.privacyInfo}>
                      <label className={styles.privacyLabel}>
                        Allow Direct Messages
                      </label>
                      <p className={styles.privacyDescription}>
                        Let other users send you direct messages
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.privacy.allowDirectMessages}
                      onChange={(e) =>
                        handleInputChange(
                          "privacy.allowDirectMessages",
                          e.target.checked
                        )
                      }
                      className={styles.privacyToggle}
                    />
                  </div>

                  <div className={styles.privacyItem}>
                    <div className={styles.privacyInfo}>
                      <label className={styles.privacyLabel}>
                        Show Online Status
                      </label>
                      <p className={styles.privacyDescription}>
                        Display when you are online to other users
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.privacy.showOnlineStatus}
                      onChange={(e) =>
                        handleInputChange(
                          "privacy.showOnlineStatus",
                          e.target.checked
                        )
                      }
                      className={styles.privacyToggle}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className={styles.actions}>
                {errors.submit && (
                  <div className={styles.submitError}>{errors.submit}</div>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={loading}
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  size="lg"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }
};

export default EditProfile;
