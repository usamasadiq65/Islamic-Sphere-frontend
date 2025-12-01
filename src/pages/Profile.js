import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import Navbar from '../components/Navbar'; // Import the Navbar component
import './Profile.css'; // You'll need to create this CSS file
import AuthService from '../apis/auth';
import ContactService from '../apis/contact';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaRegStar, FaCamera, FaImage } from 'react-icons/fa';

const Profile = () => {
  const { refreshUser, user } = useAuth();
  // Add loading state
  const [loading, setLoading] = useState(false);

  // Replace dummy userData with actual user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    phoneCountryCode: '',
    isPhoneVerified: false,
    bio: '',
    image: '',
    secondaryEmails: [],
    role: 'user',
    scholarInfo: {
      specialty: '',
      availability: '',
      languages: [],
      certifications: [],
      rating: 0
    }
  });

  // Add edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Scholar fields state
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');

  // Camera capture states
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Change Password states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Secondary Email states
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [newSecondaryEmail, setNewSecondaryEmail] = useState('');
  const [secondaryEmailLoading, setSecondaryEmailLoading] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // Phone verification states - COMMENTED OUT FOR LATER IMPLEMENTATION
  // const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  // const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
  // const [phoneLoading, setPhoneLoading] = useState(false);
  // const [showPhoneCodeInput, setShowPhoneCodeInput] = useState(false);

  // Country codes list - COMMENTED OUT FOR LATER IMPLEMENTATION
  // const countryCodes = [
  //   { code: '+1', country: 'US/Canada', flag: '🇺🇸' },
  //   { code: '+44', country: 'UK', flag: '🇬🇧' },
  //   { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  //   { code: '+91', country: 'India', flag: '🇮🇳' },
  //   { code: '+971', country: 'UAE', flag: '🇦🇪' },
  //   { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  //   { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  //   { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  //   { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  //   { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  //   { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  //   { code: '+49', country: 'Germany', flag: '🇩🇪' },
  //   { code: '+33', country: 'France', flag: '🇫🇷' },
  //   { code: '+39', country: 'Italy', flag: '🇮🇹' },
  //   { code: '+34', country: 'Spain', flag: '🇪🇸' },
  //   { code: '+61', country: 'Australia', flag: '🇦🇺' },
  //   { code: '+81', country: 'Japan', flag: '🇯🇵' },
  //   { code: '+86', country: 'China', flag: '🇨🇳' },
  //   { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  //   { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  //   { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  //   { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  //   { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  //   { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  // ];

  // Load user data on component mount
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      const userDataWithScholarInfo = {
        ...user,
        scholarInfo: user.scholarInfo || {
          specialty: '',
          availability: '',
          languages: [],
          certifications: []
        }
      };
      setUserData(userDataWithScholarInfo);
      setEditForm(userDataWithScholarInfo);
    }
  }, []);

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return name === '' || nameRegex.test(name);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return username === '' || usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === '' || emailRegex.test(email);
  };

  // Phone validation - COMMENTED OUT FOR LATER IMPLEMENTATION
  // const validatePhone = (phone) => {
  //   const phoneRegex = /^[0-9+\-\s]*$/;
  //   return phone === '' || (phoneRegex.test(phone) && phone.replace(/[^0-9]/g, '').length >= 10);
  // };

  // State for validation errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: ''
    // phone: '' - COMMENTED OUT FOR LATER IMPLEMENTATION
  });

  // Handle edit form changes with validation
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    let error = '';
    if (value.trim() !== '') {
      switch (name) {
        case 'firstName':
        case 'lastName':
          if (!validateName(value)) {
            error = 'Name should contain only letters and spaces';
          }
          break;
        case 'username':
          if (!validateUsername(value)) {
            error = 'Username can only contain letters, numbers, and underscores';
          }
          break;
        case 'email':
          if (!validateEmail(value)) {
            error = 'Please enter a valid email address';
          }
          break;
        // Phone validation - COMMENTED OUT FOR LATER IMPLEMENTATION
        // case 'phone':
        //   if (!validatePhone(value)) {
        //     error = 'Please enter a valid phone number (at least 10 digits)';
        //   }
        //   break;
        default:
          break;
      }
    }

    // Update errors state
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Update form data if validation passes
    if (!error) {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle image delete
  const handleImageDelete = () => {
    // Only update editForm - don't update userData or localStorage until save
    setEditForm(prev => ({
      ...prev,
      image: null,
      imageDeleted: true  // Track that user wants to delete the image
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      // Create update payload
      const updateData = {
        ...editForm,
        // Explicitly set image to null if deleted
        image: editForm.imageDeleted ? null : editForm.image
      };

      // Remove the imageDeleted flag before sending to API
      delete updateData.imageDeleted;

      const response = await AuthService.updateProfile(updateData);
      
      if (response.data?.user) {
        // Important: Check if the response has the updated user data
        if (editForm.imageDeleted && response.data.user.image) {
          // If backend didn't nullify the image, force it to null
          response.data.user.image = null;
        }
        
        // Update both states with the response data
        setUserData(response.data.user);
        setEditForm({
          ...response.data.user,
          imageDeleted: false
        });
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  // Get default image if user image is not present
  const getProfileImage = () => {
    return userData.image || 'https://via.placeholder.com/150?text=Profile';
  };

  // Dummy contacts data
  const [contacts, setContacts] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [filteredDummyContacts, setFilteredDummyContacts] = useState([]);

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);

  const modalRef = useRef(null);

  // Update or add this state for filtered contacts
  const [filteredContacts, setFilteredContacts] = useState([]);

  // Add this useEffect to load both contacts and contact requests on mount
  useEffect(() => {
    loadContacts();
    loadContactRequests();
  }, []);

  // Update the search handler function
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === '') {
      // If search is empty, show all contacts
      setFilteredContacts(contacts);
    } else {
      // Filter contacts based on search term
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.phone.toLowerCase().includes(term)
      );
      setFilteredContacts(filtered);
    }
  };

  // Handle removing a contact
  const handleRemoveContact = async (contactId) => {
    try {
      const response = await ContactService.removeContact(contactId);
      if (response.success) {
        await loadContacts(); // Reload contacts after removal
        alert('Contact removed successfully');
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Error removing contact:', error);
      alert('Failed to remove contact');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalSearch('');
    setSelectedContacts([]);
    setFilteredDummyContacts([]);
    document.removeEventListener('mousedown', handleClickOutside);
  };

  const handleModalShow = () => {
    setShowModal(true);
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleModalClose();
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add new function to load contact requests
  const loadContactRequests = async () => {
    const response = await ContactService.getContactRequests();
    if (response.success) {
      setUserRequests(response.data);
    } else {
      alert(response.message);
    }
  };

  // Update handleContactRequest to reload requests after approval/rejection
  const handleContactRequest = async (requestUserId, isApproved) => {
    const response = await ContactService.approveUserRequest(requestUserId, isApproved);
    if (response.success) {
      await loadContactRequests(); // Reload requests after processing
      await loadContacts(); // Also reload contacts if request was approved
      alert(`Request ${isApproved ? 'approved' : 'rejected'} successfully!`);
    } else {
      alert(response.message);
    }
  };

  // Update handleModalSearchChange to use ContactService.searchUsers
  const handleModalSearchChange = async (e) => {
    const searchTerm = e.target.value;
    setModalSearch(searchTerm);

    if (searchTerm.trim()) {
      const response = await ContactService.searchUsers(searchTerm);
      if (response.success) {
        setFilteredDummyContacts(response.data);
      } else {
        setFilteredDummyContacts([]);
      }
    } else {
      setFilteredDummyContacts([]);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c._id === contact._id);
      if (isSelected) {
        return prev.filter(c => c._id !== contact._id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleAddContacts = async () => {
    const contactIds = selectedContacts.map(contact => contact._id);
    const response = await ContactService.addContacts(contactIds);

    if (response.success) {
      await loadContacts(); // Reload contacts after adding
      handleModalClose();
      alert('Contacts added successfully!');
    } else {
      alert(response.message);
    }
  };

  // Compress and resize image before converting to base64
  const compressImage = (file, maxWidth = 400, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed JPEG
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload and conversion to base64
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('Image size must be less than 5MB');
        e.target.value = '';
        return;
      }

      try {
        // Compress the image before storing
        const compressedBase64 = await compressImage(file, 400, 0.7);
        setEditForm(prev => ({
          ...prev,
          image: compressedBase64,
          imageDeleted: false // Reset delete flag when new image is uploaded
        }));
      } catch (error) {
        toast.error('Error processing image. Please try again.');
        console.error('Image conversion error:', error);
      }
    }
  };

  // Convert file to base64 (kept for backward compatibility)
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Camera capture functions
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      setCameraStream(stream);
      setShowCameraModal(true);
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Calculate dimensions to resize to max 400px width while maintaining aspect ratio
      const maxWidth = 400;
      let width = video.videoWidth;
      let height = video.videoHeight;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);
      const imageData = canvas.toDataURL('image/jpeg', 0.7);
      setEditForm(prev => ({ ...prev, image: imageData, imageDeleted: false }));
      closeCamera();
      toast.success('Photo captured successfully!');
    }
  };

  // Set video stream when modal opens
  useEffect(() => {
    if (showCameraModal && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCameraModal, cameraStream]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Add this new function to load contacts
  const loadContacts = async () => {
    const response = await ContactService.getContacts();
    if (response.success) {
      setContacts(response.data);
      setFilteredContacts(response.data);
    } else {
      alert(response.message);
    }
  };

  const handleCancelRequest = async (contactId) => {
    try {
      const response = await ContactService.cancelContactRequest(contactId);
      if (response.success) {
        await loadContacts(); // Reload contacts after cancellation
        alert('Contact request cancelled successfully');
      } else {
        alert(response.message || 'Failed to cancel contact request');
      }
    } catch (error) {
      console.error('Error cancelling contact request:', error);
      alert('Failed to cancel contact request');
    }
  };

  // Change Password handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleChangePassword = async () => {
    const newErrors = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordForm.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    try {
      setPasswordLoading(true);
      await AuthService.changePassword(passwordForm);
      toast.success('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setPasswordErrors({});
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Secondary Email handlers
  const handleAddSecondaryEmail = async () => {
    if (!newSecondaryEmail) {
      toast.error('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newSecondaryEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setSecondaryEmailLoading(true);
      const response = await AuthService.addSecondaryEmail(newSecondaryEmail);
      if (response.data?.user) {
        setUserData(response.data.user);
        refreshUser();
      }
      toast.success('Verification code sent to the email!');
      setEmailToVerify(newSecondaryEmail);
      setShowAddEmail(false);
      setShowVerifyEmail(true);
      setNewSecondaryEmail('');
    } catch (error) {
      toast.error(error.message || 'Failed to add secondary email');
    } finally {
      setSecondaryEmailLoading(false);
    }
  };

  const handleVerifySecondaryEmail = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    try {
      setSecondaryEmailLoading(true);
      const response = await AuthService.verifySecondaryEmail({
        email: emailToVerify,
        verificationCode
      });
      if (response.data?.user) {
        setUserData(response.data.user);
        refreshUser();
      }
      toast.success('Secondary email verified successfully!');
      setShowVerifyEmail(false);
      setVerificationCode('');
      setEmailToVerify('');
    } catch (error) {
      toast.error(error.message || 'Failed to verify email');
    } finally {
      setSecondaryEmailLoading(false);
    }
  };

  const handleRemoveSecondaryEmail = async (email) => {
    if (!window.confirm('Are you sure you want to remove this email?')) {
      return;
    }

    try {
      setSecondaryEmailLoading(true);
      const response = await AuthService.removeSecondaryEmail(email);
      if (response.data?.user) {
        setUserData(response.data.user);
        refreshUser();
      }
      toast.success('Secondary email removed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to remove secondary email');
    } finally {
      setSecondaryEmailLoading(false);
    }
  };

  const handleResendSecondaryCode = async (email) => {
    try {
      setSecondaryEmailLoading(true);
      await AuthService.resendSecondaryEmailCode(email);
      toast.success('Verification code resent!');
      setEmailToVerify(email);
      setShowVerifyEmail(true);
    } catch (error) {
      toast.error(error.message || 'Failed to resend verification code');
    } finally {
      setSecondaryEmailLoading(false);
    }
  };

  // Phone verification handlers - COMMENTED OUT FOR LATER IMPLEMENTATION
  // const handleSendPhoneCode = async () => {
  //   if (!phoneNumber) {
  //     toast.error('Please enter a phone number');
  //     return;
  //   }

  //   // Basic phone number validation (only digits, 6-15 characters)
  //   const cleanPhone = phoneNumber.replace(/\D/g, '');
  //   if (cleanPhone.length < 6 || cleanPhone.length > 15) {
  //     toast.error('Please enter a valid phone number (6-15 digits)');
  //     return;
  //   }

  //   try {
  //     setPhoneLoading(true);
  //     const response = await AuthService.sendPhoneVerificationCode(cleanPhone, phoneCountryCode);
  //     setShowPhoneCodeInput(true);
      
  //     // For development - show code prominently (REMOVE IN PRODUCTION!)
  //     if (response.data?.devCode) {
  //       toast.success(
  //         `🔐 Your verification code is: ${response.data.devCode}`, 
  //         { autoClose: false, closeOnClick: false }
  //       );
  //     } else {
  //       toast.success('Verification code sent to your phone!');
  //     }
  //   } catch (error) {
  //     toast.error(error.message || 'Failed to send verification code');
  //   } finally {
  //     setPhoneLoading(false);
  //   }
  // };

  // const handleVerifyPhone = async () => {
  //   if (!phoneVerificationCode) {
  //     toast.error('Please enter the verification code');
  //     return;
  //   }

  //   try {
  //     setPhoneLoading(true);
  //     const response = await AuthService.verifyPhoneNumber(phoneVerificationCode);
  //     if (response.data?.user) {
  //       setUserData(response.data.user);
  //       refreshUser();
  //     }
  //     toast.success('Phone number verified successfully!');
  //     setShowPhoneVerification(false);
  //     setShowPhoneCodeInput(false);
  //     setPhoneNumber('');
  //     setPhoneVerificationCode('');
  //   } catch (error) {
  //     toast.error(error.message || 'Failed to verify phone number');
  //   } finally {
  //     setPhoneLoading(false);
  //   }
  // };

  // const handleRemovePhone = async () => {
  //   if (!window.confirm('Are you sure you want to remove your phone number?')) {
  //     return;
  //   }

  //   try {
  //     setPhoneLoading(true);
  //     const response = await AuthService.removePhoneNumber();
  //     if (response.data?.user) {
  //       setUserData(response.data.user);
  //       refreshUser();
  //     }
  //     toast.success('Phone number removed successfully!');
  //   } catch (error) {
  //     toast.error(error.message || 'Failed to remove phone number');
  //   } finally {
  //     setPhoneLoading(false);
  //   }
  // };

  // Scholar field handlers
  const handleScholarInfoChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      scholarInfo: {
        ...prev.scholarInfo,
        [field]: value
      }
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !editForm.scholarInfo?.languages?.includes(newLanguage.trim())) {
      setEditForm(prev => ({
        ...prev,
        scholarInfo: {
          ...prev.scholarInfo,
          languages: [...(prev.scholarInfo?.languages || []), newLanguage.trim()]
        }
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (langToRemove) => {
    setEditForm(prev => ({
      ...prev,
      scholarInfo: {
        ...prev.scholarInfo,
        languages: (prev.scholarInfo?.languages || []).filter(lang => lang !== langToRemove)
      }
    }));
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && !editForm.scholarInfo?.certifications?.includes(newCertification.trim())) {
      setEditForm(prev => ({
        ...prev,
        scholarInfo: {
          ...prev.scholarInfo,
          certifications: [...(prev.scholarInfo?.certifications || []), newCertification.trim()]
        }
      }));
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (certToRemove) => {
    setEditForm(prev => ({
      ...prev,
      scholarInfo: {
        ...prev.scholarInfo,
        certifications: (prev.scholarInfo?.certifications || []).filter(cert => cert !== certToRemove)
      }
    }));
  };

  // Save changes handler with validation
  const handleSaveChanges = async () => {
    // Validate all fields before submission
    const newErrors = {};
    
    // Check required fields
    if (!editForm.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!editForm.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!editForm.username?.trim()) newErrors.username = 'Username is required';
    if (!editForm.email?.trim()) newErrors.email = 'Email is required';
    
    // Check field formats
    if (editForm.firstName && !validateName(editForm.firstName)) {
      newErrors.firstName = 'First name should contain only letters and spaces';
    }
    if (editForm.lastName && !validateName(editForm.lastName)) {
      newErrors.lastName = 'Last name should contain only letters and spaces';
    }
    if (editForm.username && !validateUsername(editForm.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    if (editForm.email && !validateEmail(editForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    // Phone validation - COMMENTED OUT FOR LATER IMPLEMENTATION
    // if (editForm.phone && !validatePhone(editForm.phone)) {
    //   newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    // }
    
    // If there are validation errors, don't proceed with submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the form errors before saving');
      return;
    }
    
    try {
      setLoading(true);
      
      const updateData = {
        ...editForm,
        image: editForm.imageDeleted ? null : editForm.image
      };

      // Remove the imageDeleted flag before sending to API
      delete updateData.imageDeleted;

      // Include scholarInfo for scholars
      if (userData.role === 'scholar' && editForm.scholarInfo) {
        updateData.scholarInfo = editForm.scholarInfo;
      }

      const response = await AuthService.updateProfile(updateData);
      
      if (response.data?.user) {
        // Force null image if deleted
        if (editForm.imageDeleted) {
          response.data.user.image = null;
        }
        
        // Update both states and localStorage
        setUserData(response.data.user);
        setEditForm({
          ...response.data.user,
          imageDeleted: false
        });
        
        // Update localStorage with the new user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Refresh the user context to update navbar
        refreshUser();
        
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Replace the existing Navbar with the imported component */}
      <Navbar />

      <Container className="profile-container">
        <div className="page-header">
          <h1>User Profile</h1>
        </div>

        {/* User Info Section */}
        <Card className="profile-card">
          <Card.Header className="card-header">
            <h2>User Information</h2>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <div className="profile-image-container position-relative">
                  {(isEditing ? !editForm.imageDeleted && (editForm.image || userData.image) : userData.image) ? (
                    <>
                      <img
                        src={editForm.image || userData.image}
                        alt="Profile"
                        className="profile-image"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleImageDelete}
                          className="position-absolute top-0 end-0 btn btn-danger rounded-circle"
                          style={{ width: '24px', height: '24px', padding: '0' }}
                        >
                          ×
                        </button>
                      )}
                    </>
                  ) : (
                    <img
                      src="https://via.placeholder.com/150?text=Profile"
                      // alt="Profile"
                      className="profile-image"
                    />
                  )}
                </div>
              </Col>
              <Col md={8}>
                <div className="user-info">
                  {isEditing ? (
                    // Edit Form
                    <>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Username *</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={editForm.username || ''}
                            onChange={handleEditChange}
                            isInvalid={!!errors.username}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={editForm.firstName || ''}
                            onChange={handleEditChange}
                            isInvalid={!!errors.firstName}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={editForm.lastName || ''}
                            onChange={handleEditChange}
                            isInvalid={!!errors.lastName}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={editForm.email || ''}
                            onChange={handleEditChange}
                            isInvalid={!!errors.email}
                            required
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                        {/* Phone field - COMMENTED OUT FOR LATER IMPLEMENTATION */}
                        {/* <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            {userData.phone ? (
                              <div className="p-2 bg-light rounded flex-grow-1">
                                <span>{userData.phoneCountryCode} {userData.phone}</span>
                                {userData.isPhoneVerified ? (
                                  <span className="badge bg-success ms-2">Verified</span>
                                ) : (
                                  <span className="badge bg-warning text-dark ms-2">Not Verified</span>
                                )}
                              </div>
                            ) : (
                              <div className="p-2 bg-light rounded flex-grow-1 text-muted">
                                No phone number added
                              </div>
                            )}
                          </div>
                          <Form.Text className="text-muted">
                            Manage your phone number in the "Phone Number" section below
                          </Form.Text>
                        </Form.Group> */}
                        <Form.Group className="mb-3">
                          <Form.Label>Bio</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="bio"
                            value={editForm.bio || ''}
                            onChange={handleEditChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Profile Image</Form.Label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="position-relative">
                              <img
                                src={editForm.image || getProfileImage()}
                                alt="Profile Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                              />
                            </div>
                            <div className="d-flex flex-column gap-2">
                              <div className="d-flex gap-2">
                                <label className="btn btn-outline-primary btn-sm" style={{ cursor: 'pointer' }}>
                                  <FaImage style={{ marginRight: '5px' }} />
                                  Choose File
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                  />
                                </label>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={openCamera}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <FaCamera style={{ marginRight: '5px' }} />
                                  Capture
                                </Button>
                              </div>
                              <Form.Text className="text-muted">
                                Upload or capture a profile image
                              </Form.Text>
                            </div>
                          </div>
                        </Form.Group>

                        {/* Scholar-specific fields */}
                        {userData.role === 'scholar' && (
                          <div className="scholar-fields-section">
                            <h5 className="mb-3 mt-4 scholar-fields-title">Scholar Information</h5>
                            
                            <Form.Group className="mb-3">
                              <Form.Label>Specialty *</Form.Label>
                              <Form.Control
                                type="text"
                                value={editForm.scholarInfo?.specialty || ''}
                                onChange={(e) => handleScholarInfoChange('specialty', e.target.value)}
                                placeholder="e.g., Fiqh (Hanafi) & Contemporary Fatwa"
                              />
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label>Availability *</Form.Label>
                              <Form.Control
                                type="text"
                                value={editForm.scholarInfo?.availability || ''}
                                onChange={(e) => handleScholarInfoChange('availability', e.target.value)}
                                placeholder="e.g., Monday - Thursday: 6 PM - 9 PM"
                              />
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label>Languages</Form.Label>
                              <div className="languages-container mb-2">
                                {(editForm.scholarInfo?.languages || []).map((lang, index) => (
                                  <span key={index} className="language-badge">
                                    {lang}
                                    <button
                                      type="button"
                                      className="remove-badge-btn"
                                      onClick={() => handleRemoveLanguage(lang)}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                              <div className="d-flex gap-2">
                                <Form.Control
                                  type="text"
                                  value={newLanguage}
                                  onChange={(e) => setNewLanguage(e.target.value)}
                                  placeholder="Add a language"
                                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                                />
                                <Button variant="outline-primary" onClick={handleAddLanguage}>
                                  Add
                                </Button>
                              </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label>Certifications</Form.Label>
                              <div className="certifications-container mb-2">
                                {(editForm.scholarInfo?.certifications || []).map((cert, index) => (
                                  <span key={index} className="certification-badge">
                                    {cert}
                                    <button
                                      type="button"
                                      className="remove-badge-btn"
                                      onClick={() => handleRemoveCertification(cert)}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                              <div className="d-flex gap-2">
                                <Form.Control
                                  type="text"
                                  value={newCertification}
                                  onChange={(e) => setNewCertification(e.target.value)}
                                  placeholder="Add a certification"
                                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
                                />
                                <Button variant="outline-primary" onClick={handleAddCertification}>
                                  Add
                                </Button>
                              </div>
                            </Form.Group>
                          </div>
                        )}

                        <div className="d-flex gap-2">
                          <Button
                            variant="success"
                            onClick={handleSaveChanges}
                            disabled={loading}
                            style={loading ? { backgroundColor: '#6c757d', borderColor: '#6c757d' } : {}}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button
                            variant="danger"
                            disabled={loading}
                            onClick={() => {
                              // Reset editForm to original userData values
                              setEditForm({
                                ...userData,
                                imageDeleted: false
                              });
                              setIsEditing(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </>
                  ) : (
                    // Display Info
                    <>
                      <div className="info-row">
                        <div className="info-label">Username:</div>
                        <div className="info-value">{userData.username}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label">Name:</div>
                        <div className="info-value">{`${userData.firstName || ''} ${userData.lastName || ''}`}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label">Email:</div>
                        <div className="info-value">{userData.email}</div>
                      </div>
                      {/* Phone row - COMMENTED OUT FOR LATER IMPLEMENTATION */}
                      {/* <div className="info-row">
                        <div className="info-label">Phone:</div>
                        <div className="info-value">
                          {userData.phone ? (
                            <span>
                              {userData.phoneCountryCode} {userData.phone}
                              {userData.isPhoneVerified ? (
                                <span className="badge bg-success ms-2">Verified</span>
                              ) : (
                                <span className="badge bg-warning text-dark ms-2">Not Verified</span>
                              )}
                            </span>
                          ) : (
                            <span className="text-muted">Not provided</span>
                          )}
                        </div>
                      </div> */}
                      <div className="info-row">
                        <div className="info-label">Bio:</div>
                        <div className="info-value">{userData.bio}</div>
                      </div>
                      <Button
                        variant="success"
                        onClick={() => setIsEditing(true)}
                        className="edit-button"
                      >
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Scholar Information Section - Only for Scholars */}
        {userData.role === 'scholar' && (
          <Card className="profile-card mb-4 scholar-info-card">
            <Card.Header className="card-header">
              <h2>Scholar Information</h2>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="profile-image-container">
                    <img
                      src={userData.image || "https://via.placeholder.com/150?text=Scholar"}
                      alt="Scholar"
                      className="profile-image"
                    />
                  </div>
                </Col>
                <Col md={8}>
                  <div className="user-info">
                    <div className="info-row">
                      <div className="info-label">Specialty:</div>
                      <div className="info-value">{userData.scholarInfo?.specialty || 'Not specified'}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Availability:</div>
                      <div className="info-value">{userData.scholarInfo?.availability || 'Not specified'}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Rating:</div>
                      <div className="info-value">
                        {userData.scholarInfo?.rating > 0 ? (
                          <div className="rating-display">
                            {[1, 2, 3, 4, 5].map((star) => (
                              star <= Math.round(userData.scholarInfo.rating) ? (
                                <FaStar key={star} className="star-filled" />
                              ) : (
                                <FaRegStar key={star} className="star-empty" />
                              )
                            ))}
                            <span className="rating-value">({userData.scholarInfo.rating.toFixed(1)})</span>
                          </div>
                        ) : (
                          <span className="no-rating">Not yet rated</span>
                        )}
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Languages:</div>
                      <div className="info-value">
                        {userData.scholarInfo?.languages?.length > 0 ? (
                          <div className="languages-display">
                            {userData.scholarInfo.languages.map((lang, index) => (
                              <span key={index} className="display-badge language-badge-display">{lang}</span>
                            ))}
                          </div>
                        ) : (
                          'Not specified'
                        )}
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-label" style={{width: 'auto', marginRight: '10px'}}>Certifications:</div>
                      <div className="info-value">
                        {userData.scholarInfo?.certifications?.length > 0 ? (
                          <div className="certifications-display">
                            {userData.scholarInfo.certifications.map((cert, index) => (
                              <span key={index} className="display-badge certification-badge-display">{cert}</span>
                            ))}
                          </div>
                        ) : (
                          'Not specified'
                        )}
                      </div>
                    </div>
                    <p className="text-muted mt-3 mb-0">
                      <small>To update your scholar information, click "Edit Profile" above. Rating is assigned by administrators.</small>
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Security Section - Change Password */}
        <Card className="profile-card mb-4">
          <Card.Header className="card-header">
            <h2>Security</h2>
          </Card.Header>
          <Card.Body>
            {!showChangePassword ? (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Password</h5>
                  <p className="text-muted mb-0">Change your account password</p>
                </div>
                <Button
                  variant="outline-primary"
                  onClick={() => setShowChangePassword(true)}
                >
                  Change Password
                </Button>
              </div>
            ) : (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    isInvalid={!!passwordErrors.currentPassword}
                    placeholder="Enter current password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordErrors.currentPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    isInvalid={!!passwordErrors.newPassword}
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordErrors.newPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmNewPassword"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChange}
                    isInvalid={!!passwordErrors.confirmNewPassword}
                    placeholder="Confirm new password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordErrors.confirmNewPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmNewPassword: ''
                      });
                      setPasswordErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>

        {/* Email Management Section */}
        <Card className="profile-card mb-4">
          <Card.Header className="card-header">
            <h2>Email Addresses</h2>
          </Card.Header>
          <Card.Body>
            {/* Primary Email */}
            <div className="mb-4">
              <h5>Primary Email</h5>
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                <div>
                  <span className="me-2">{userData.email}</span>
                  <span className="badge bg-success">Primary</span>
                  <span className="badge bg-info ms-2">Verified</span>
                </div>
                {/* <span className="text-muted small">Cannot be removed</span> */}
              </div>
            </div>

            {/* Secondary Emails */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Secondary Emails</h5>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => setShowAddEmail(true)}
                >
                  + Add Email
                </Button>
              </div>

              {userData.secondaryEmails && userData.secondaryEmails.length > 0 ? (
                <div className="secondary-emails-list">
                  {userData.secondaryEmails.map((emailObj, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2"
                    >
                      <div>
                        <span className="me-2">{emailObj.email}</span>
                        {emailObj.isVerified ? (
                          <span className="badge bg-success">Verified</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Pending Verification</span>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        {!emailObj.isVerified && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleResendSecondaryCode(emailObj.email)}
                            disabled={secondaryEmailLoading}
                          >
                            Verify
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveSecondaryEmail(emailObj.email)}
                          disabled={secondaryEmailLoading}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No secondary emails added yet.</p>
              )}
            </div>

            {/* Add Secondary Email Form */}
            {showAddEmail && (
              <div className="add-email-form p-3 border rounded mb-3">
                <h6>Add Secondary Email</h6>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    value={newSecondaryEmail}
                    onChange={(e) => setNewSecondaryEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleAddSecondaryEmail}
                    disabled={secondaryEmailLoading}
                  >
                    {secondaryEmailLoading ? 'Adding...' : 'Add Email'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setShowAddEmail(false);
                      setNewSecondaryEmail('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Verify Secondary Email Form */}
            {showVerifyEmail && (
              <div className="verify-email-form p-3 border rounded mb-3">
                <h6>Verify Email: {emailToVerify}</h6>
                <p className="text-muted small">Enter the verification code sent to your email.</p>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit verification code"
                    maxLength={6}
                  />
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleVerifySecondaryEmail}
                    disabled={secondaryEmailLoading}
                  >
                    {secondaryEmailLoading ? 'Verifying...' : 'Verify'}
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleResendSecondaryCode(emailToVerify)}
                    disabled={secondaryEmailLoading}
                  >
                    Resend Code
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setShowVerifyEmail(false);
                      setVerificationCode('');
                      setEmailToVerify('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Phone Number Verification Section - COMMENTED OUT FOR LATER IMPLEMENTATION */}
        {/* <Card className="profile-card mb-4">
          <Card.Header className="card-header">
            <h2>Phone Number</h2>
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <h5>Your Phone Number</h5>
              {userData.phone ? (
                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                  <div>
                    <span className="me-2">{userData.phoneCountryCode} {userData.phone}</span>
                    {userData.isPhoneVerified ? (
                      <span className="badge bg-success">Verified</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Not Verified</span>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    {!userData.isPhoneVerified && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setPhoneNumber(userData.phone);
                          setPhoneCountryCode(userData.phoneCountryCode || '+1');
                          setShowPhoneVerification(true);
                        }}
                        disabled={phoneLoading}
                      >
                        Verify
                      </Button>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleRemovePhone}
                      disabled={phoneLoading}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-muted mb-0">No phone number added yet.</p>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => setShowPhoneVerification(true)}
                  >
                    + Add Phone
                  </Button>
                </div>
              )}
            </div>

            {showPhoneVerification && (
              <div className="add-phone-form p-3 border rounded mb-3">
                <h6>{userData.phone ? 'Verify Phone Number' : 'Add Phone Number'}</h6>
                <p className="text-muted small">
                  Enter your phone number to receive a verification code via SMS.
                </p>
                
                {!showPhoneCodeInput ? (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Country Code</Form.Label>
                      <Form.Select
                        value={phoneCountryCode}
                        onChange={(e) => setPhoneCountryCode(e.target.value)}
                        style={{ maxWidth: '250px' }}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code} ({country.country})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter phone number (digits only)"
                        maxLength={15}
                      />
                      <Form.Text className="text-muted">
                        Enter only the phone number without country code
                      </Form.Text>
                    </Form.Group>
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleSendPhoneCode}
                        disabled={phoneLoading}
                      >
                        {phoneLoading ? 'Sending...' : 'Send Code'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setShowPhoneVerification(false);
                          setPhoneNumber('');
                          setPhoneCountryCode('+1');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3 p-2 bg-light rounded">
                      <small className="text-muted">Verification code sent to:</small>
                      <div className="fw-bold">{phoneCountryCode} {phoneNumber}</div>
                    </div>
                    <Form.Group className="mb-3">
                      <Form.Label>Verification Code</Form.Label>
                      <Form.Control
                        type="text"
                        value={phoneVerificationCode}
                        onChange={(e) => setPhoneVerificationCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                    </Form.Group>
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleVerifyPhone}
                        disabled={phoneLoading}
                      >
                        {phoneLoading ? 'Verifying...' : 'Verify'}
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={handleSendPhoneCode}
                        disabled={phoneLoading}
                      >
                        Resend Code
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setShowPhoneVerification(false);
                          setShowPhoneCodeInput(false);
                          setPhoneNumber('');
                          setPhoneVerificationCode('');
                          setPhoneCountryCode('+1');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card.Body>
        </Card> */}

        {/* Add this new section before the Contacts Section */}
        <Card className="requests-card mb-4">
          <Card.Header className="card-header">
            <h2>Contact Requests</h2>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table className="requests-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userRequests.length > 0 ? (
                    userRequests.map(request => (
                      <tr key={request.id}>
                        <td>{request.name}</td>
                        <td>{request.username}</td>
                        <td>{request.email}</td>
                        <td>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleContactRequest(request._id, true)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleContactRequest(request._id, false)}
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No pending requests
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Contacts Section */}
        <Card className="contacts-card">
          <Card.Header className="card-header">
            <h2>Contacts</h2>
          </Card.Header>
          <Card.Body>
            {/* Add Contact Button */}
            <div className="add-button-wrapper">
              <Button variant="success" className="add-contact-button" onClick={handleModalShow}>
                Add New Contact
              </Button>
            </div>


            {/* Search Bar */}
            <div className="search-container">
              <Form.Control
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>


            {/* Contacts Table */}
            <div className="table-responsive">
              <Table className="contacts-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date Added</th>
                    <th>Status/Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map(contact => (
                      <tr key={contact._id}>
                        <td>{contact.username}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone || '-'}</td>
                        <td>{new Date(contact.dateAdded).toLocaleDateString()}</td>
                        <td>
                          {contact.approved ? (
                            <Button
                              variant="danger"
                              size="sm"
                              className="remove-button"
                              onClick={() => handleRemoveContact(contact._id)}
                            >
                              Remove
                            </Button>
                          ) : (
                            <div className="d-flex align-items-center gap-2">
                              <span className="pending-status">Pending Approval</span>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="cancel-request-button"
                                onClick={() => handleCancelRequest(contact._id)}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-contacts">
                        {searchTerm ? 'No matching contacts found' : 'No contacts to display'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {showModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal" ref={modalRef}>
            <div className="custom-modal-header">
              <h2>Add New Contacts</h2>
              <button
                className="close-button"
                onClick={handleModalClose}
              >
                &times;
              </button>
            </div>
            <div className="custom-modal-body">
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={modalSearch}
                  onChange={handleModalSearchChange}
                  className="modal-search-input"
                  autoFocus
                />
              </div>
              <div className="contact-selection-list">
                {filteredDummyContacts.length > 0 ? (
                  filteredDummyContacts.map(contact => (
                    <div
                      key={contact._id}
                      className="contact-selection-item"
                    >
                      <label
                        className="contact-selection-label"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedContacts.some(c => c._id === contact._id)}
                          onChange={() => handleContactSelect(contact)}
                          className="contact-checkbox"
                        />
                        <div className="contact-info">
                          <div className="contact-name">
                            <strong>{contact.username}</strong>
                          </div>
                          <div className="contact-details">
                            <span>{contact.email}</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    {modalSearch.trim() ? 'No matching users found' : 'Start typing to search for users'}
                  </div>
                )}
              </div>
            </div>
            <div className="custom-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleAddContacts}
                disabled={selectedContacts.length === 0}
              >
                Add Selected ({selectedContacts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      {showCameraModal && (
        <div className="camera-modal-backdrop">
          <div className="camera-modal">
            <div className="camera-modal-header">
              <h3>Capture Photo</h3>
              <button className="close-button" onClick={closeCamera}>×</button>
            </div>
            <div className="camera-modal-body">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            <div className="camera-modal-footer">
              <Button variant="secondary" onClick={closeCamera}>
                Cancel
              </Button>
              <Button variant="success" onClick={capturePhoto}>
                <FaCamera style={{ marginRight: '5px' }} />
                Capture
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;