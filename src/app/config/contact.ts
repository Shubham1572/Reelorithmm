/** Central contact configuration — update values here only. */

export const CONTACT = {
  email: "solankishubham966@gmail.com",
  phone: "+91 7567745309",
  /** WhatsApp click-to-chat number — digits only, no spaces or symbols. */
  whatsappNumber: "917567745309",
  location: "Bhavnagar, Gujarat, India",
  formSubmitUrl: "https://formsubmit.co/ajax/solankishubham966@gmail.com",
  instagram: {
    mainHandle: "@reelorithm",
    mainUrl: "https://www.instagram.com/reelorithmm/",
    clipsHandle: "@clipbyshubham",
    clipsUrl: "https://www.instagram.com/clipsbyshubhamm/",
    personalUrl: "https://www.instagram.com/_.shubhamm.__15/",
  },
} as const;

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello, I'm interested in your services. I would like to know more about your work and pricing. Please share the details with me.";

/** Builds a WhatsApp click-to-chat URL with a pre-filled (editable) message. */
export function getWhatsAppUrl(message = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
