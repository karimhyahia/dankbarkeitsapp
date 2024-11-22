import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Camera, Key, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { updateProfile, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useStorage } from '../hooks/useStorage';
import ImageCropModal from './ImageCropModal';

interface ProfileEditModalProps {
  onClose: () => void;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6"
          >
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-xl font-medium">{title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Abbrechen
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-2.5 font-medium transition-colors"
              >
                Bestätigen
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function ProfileEditModal({ onClose }: ProfileEditModalProps) {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [photoURL, setPhotoURL] = useState(auth.currentUser?.photoURL || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useStorage();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImage: Blob) => {
    if (!auth.currentUser) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      const imageUrl = await uploadImage(
        new File([croppedImage], 'profile.jpg', { type: 'image/jpeg' }),
        `profile-images/${auth.currentUser.uid}/profile.jpg`
      );
      
      await updateProfile(auth.currentUser, { photoURL: imageUrl });
      setPhotoURL(imageUrl);
      setSuccess('Profilbild erfolgreich aktualisiert');
      setSelectedImage(null);
    } catch (err) {
      setError('Fehler beim Hochladen des Bildes');
      console.error('Upload error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser?.email) return;

    try {
      setError('');
      setSuccess('');
      
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      setSuccess('Passwort erfolgreich geändert');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError('Aktuelles Passwort ist falsch oder Fehler beim Ändern');
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser?.email) return;

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);
      onClose();
    } catch (err) {
      setError('Fehler beim Löschen des Kontos');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      setError('');
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
      });
      setSuccess('Profil erfolgreich aktualisiert');
    } catch (err) {
      setError('Fehler beim Aktualisieren des Profils');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-medium">Profil bearbeiten</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-200 rounded-xl text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center overflow-hidden">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || isSaving}
                  className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full"
                  placeholder="Dein Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">E-Mail</label>
              <input
                type="email"
                value={auth.currentUser?.email || ''}
                disabled
                className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-2.5 text-gray-500 dark:text-gray-400"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
              >
                Speichern
              </button>
            </div>
          </form>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-lg font-medium mb-4 flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Passwort ändern</span>
            </h4>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Aktuelles Passwort
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Neues Passwort
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Passwort ändern
              </button>
            </form>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-lg font-medium mb-4 flex items-center space-x-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              <span>Konto löschen</span>
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten werden permanent gelöscht.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Konto unwiderruflich löschen</span>
            </button>
          </div>
        </div>
      </motion.div>

      {selectedImage && (
        <ImageCropModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
          onCropComplete={handleCropComplete}
          isSaving={isSaving}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Konto löschen"
        message="Bist du sicher, dass du dein Konto und alle damit verbundenen Daten unwiderruflich löschen möchtest?"
      />
    </div>
  );
}