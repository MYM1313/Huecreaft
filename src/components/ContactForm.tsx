import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingLabelInput } from './FloatingLabelInput';
import { PhoneInput } from './PhoneInput';
import { ServiceDropdown } from './ServiceDropdown';
import { AutoExpandTextarea } from './AutoExpandTextarea';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const SERVICES = [
  "Interior Design",
  "Exterior Renovation",
  "Custom Furniture",
  "Lighting Consultation",
  "Color Consultation",
  "Space Planning",
  "Full Home Transformation"
];

export const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    service: '',
    details: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.service) newErrors.service = "Please select a service";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] p-8 sm:p-10 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center border border-gray-100"
      >
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-7 h-7 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Request Received</h3>
        <p className="text-gray-500 leading-relaxed text-[13px] font-light px-4">
          Thank you for reaching out. Our team will contact you within 24 hours to discuss your transformation.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 transition-colors"
        >
          Send another request
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-[480px] p-5 sm:p-7 bg-white rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <FloatingLabelInput
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          error={errors.fullName}
          disabled={isSubmitting}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <PhoneInput
            label="Phone"
            value={formData.phone}
            onValueChange={(val) => setFormData({ ...formData, phone: val })}
            error={errors.phone}
            disabled={isSubmitting}
          />
          <FloatingLabelInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            disabled={isSubmitting}
          />
        </div>

        <ServiceDropdown
          label="Service Type"
          options={SERVICES}
          value={formData.service}
          onChange={(val) => setFormData({ ...formData, service: val })}
          error={errors.service}
        />

        <AutoExpandTextarea
          label="Project Details"
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          disabled={isSubmitting}
        />

        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className={cn(
            "w-full h-12 rounded-[18px] text-white font-bold text-[10px] uppercase tracking-[0.25em] transition-all duration-200 bg-blue-600 flex items-center justify-center gap-2 border-x border-t border-blue-400/30 border-b-4 border-blue-800/50 active:translate-y-1 active:border-b-[1px]",
            isSubmitting ? "cursor-progress opacity-80" : "hover:bg-blue-700 hover:-translate-y-0.5 hover:border-b-[5px]"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            "Request Consultation"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};
