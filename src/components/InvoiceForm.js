import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import InvoicePreview from './InvoicePreview';
import './InvoiceForm.css';

// Company slogan
export const COMPANY_SLOGAN = "Subject to Navi Mumbai Jurisdiction            || OM NAMAH SHIVAY ||           || SHREE SAI KRUPA ||       Mobile: 9999913023,9999912345";

const InvoiceForm = () => {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
    defaultValues: {
      fromCompany: "New Anand Roadlines",
      fromAddress: "Pitampura, Delhi",
      fromEmail: "ashish@gmail.com",
      fromPhone: "9999913023",
      toCompany: "Mumbai Client",
      toAddress: "Lower Parel, Mumbai, Maharashtra",
      toEmail: "client1@gmail.com",
      currency: 'INR',
      taxRate: 18,
      items: [{ description: 'Coke', quantity: 1, price: 8000 }],
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 10)
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const [invoiceData, setInvoiceData] = useState(null);
  
  const items = watch('items');
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.price) || 0), 0);
  };
  
  const onSubmit = (data) => {
    // Add unique invoice ID and calculated fields
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * parseFloat(data.taxRate)) / 100;
    
    const invoiceWithId = {
      ...data,
      invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      subtotal: subtotal,
      taxAmount: taxAmount,
      total: subtotal + taxAmount
    };
    setInvoiceData(invoiceWithId);
  };

  return (
    <div className="invoice-container">
      <div className="form-container">
        <h2 className="form-title">Invoice Generator</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <h3>Your Information</h3>
            <div className="form-group">
              <label>Your Company Name</label>
              <input
                {...register('fromCompany', { required: 'Company name is required' })}
                className={errors.fromCompany ? 'error' : ''}
              />
              {errors.fromCompany && <p className="error-message">{errors.fromCompany.message}</p>}
            </div>
            <div className="form-group">
              <label>Your Address</label>
              <textarea
                {...register('fromAddress', { required: 'Address is required' })}
                className={errors.fromAddress ? 'error' : ''}
              />
              {errors.fromAddress && <p className="error-message">{errors.fromAddress.message}</p>}
            </div>
            <div className="form-group">
              <label>Your Email</label>
              <input
                type="email"
                {...register('fromEmail', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={errors.fromEmail ? 'error' : ''}
              />
              {errors.fromEmail && <p className="error-message">{errors.fromEmail.message}</p>}
            </div>
            <div className="form-group">
              <label>Your Phone</label>
              <input
                {...register('fromPhone', { required: 'Phone is required' })}
                className={errors.fromPhone ? 'error' : ''}
              />
              {errors.fromPhone && <p className="error-message">{errors.fromPhone.message}</p>}
            </div>
          </div>

          <div className="form-section">
            <h3>Client Information</h3>
            <div className="form-group">
              <label>Client Company Name</label>
              <input
                {...register('toCompany', { required: 'Client company name is required' })}
                className={errors.toCompany ? 'error' : ''}
              />
              {errors.toCompany && <p className="error-message">{errors.toCompany.message}</p>}
            </div>
            <div className="form-group">
              <label>Client Address</label>
              <textarea
                {...register('toAddress', { required: 'Client address is required' })}
                className={errors.toAddress ? 'error' : ''}
              />
              {errors.toAddress && <p className="error-message">{errors.toAddress.message}</p>}
            </div>
            <div className="form-group">
              <label>Client Email</label>
              <input
                type="email"
                {...register('toEmail', { 
                  required: 'Client email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={errors.toEmail ? 'error' : ''}
              />
              {errors.toEmail && <p className="error-message">{errors.toEmail.message}</p>}
            </div>
          </div>

          <div className="form-section">
            <h3>Invoice Details</h3>
            <div className="form-group">
              <label>Invoice Date</label>
              <input
                type="date"
                {...register('invoiceDate', { required: 'Invoice date is required' })}
                className={errors.invoiceDate ? 'error' : ''}
              />
              {errors.invoiceDate && <p className="error-message">{errors.invoiceDate.message}</p>}
            </div>
            
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                {...register('dueDate', { required: 'Due date is required' })}
                className={errors.dueDate ? 'error' : ''}
              />
              {errors.dueDate && <p className="error-message">{errors.dueDate.message}</p>}
            </div>
            
            <div className="form-group">
              <label>Payment Terms</label>
              <select {...register('paymentTerms', { required: 'Payment terms are required' })}>
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
              </select>
              {errors.paymentTerms && <p className="error-message">{errors.paymentTerms.message}</p>}
            </div>
            
            <input type="hidden" {...register('currency')} value="INR" />
            
            <div className="form-group">
              <label>Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                {...register('taxRate', { 
                  required: 'Tax rate is required',
                  min: {
                    value: 0,
                    message: 'Tax rate cannot be negative'
                  }
                })}
                className={errors.taxRate ? 'error' : ''}
              />
              {errors.taxRate && <p className="error-message">{errors.taxRate.message}</p>}
            </div>
          </div>

          <div className="form-section">
            <h3>Items</h3>
            <div className="items-table">
              <div className="items-header">
                <div className="item-description-header">Description</div>
                <div className="item-quantity-header">Quantity</div>
                <div className="item-price-header">Rate (₹)</div>
                <div className="item-total-header">Total</div>
                <div className="item-action-header"></div>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="item-row">
                  <div className="item-description">
                    <input
                      {...register(`items.${index}.description`, { required: 'Description is required' })}
                      placeholder="Item description"
                      className={errors.items?.[index]?.description ? 'error' : ''}
                    />
                    {errors.items?.[index]?.description && 
                      <p className="error-message">{errors.items[index].description.message}</p>}
                  </div>
                  
                  <div className="item-quantity">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      {...register(`items.${index}.quantity`, { 
                        required: 'Quantity is required',
                        min: {
                          value: 1,
                          message: 'Minimum quantity is 1'
                        },
                        valueAsNumber: true
                      })}
                      className={errors.items?.[index]?.quantity ? 'error' : ''}
                    />
                    {errors.items?.[index]?.quantity && 
                      <p className="error-message">{errors.items[index].quantity.message}</p>}
                  </div>
                  
                  <div className="item-price">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register(`items.${index}.price`, { 
                        required: 'Price is required',
                        min: {
                          value: 0,
                          message: 'Price cannot be negative'
                        },
                        valueAsNumber: true
                      })}
                      className={errors.items?.[index]?.price ? 'error' : ''}
                    />
                    {errors.items?.[index]?.price && 
                      <p className="error-message">{errors.items[index].price.message}</p>}
                  </div>
                  
                  <div className="item-total">
                    ₹{(parseFloat(items[index]?.quantity || 0) * parseFloat(items[index]?.price || 0)).toFixed(2)}
                  </div>
                  
                  <div className="item-action">
                    {fields.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-item-btn" 
                        onClick={() => remove(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="add-item-row">
                <button 
                  type="button" 
                  className="add-item-btn" 
                  onClick={() => append({ description: '', quantity: 1, price: 0 })}
                >
                  + Add Item
                </button>
              </div>

              <div className="items-summary">
                <div className="summary-row">
                  <div className="summary-label">Subtotal:</div>
                  <div className="summary-value">₹{calculateSubtotal().toFixed(2)}</div>
                </div>
                <div className="summary-row">
                  <div className="summary-label">Tax ({watch('taxRate') || 0}%):</div>
                  <div className="summary-value">₹{((calculateSubtotal() * (parseFloat(watch('taxRate')) || 0)) / 100).toFixed(2)}</div>
                </div>
                <div className="summary-row total">
                  <div className="summary-label">Total:</div>
                  <div className="summary-value">₹{(calculateSubtotal() + ((calculateSubtotal() * (parseFloat(watch('taxRate')) || 0)) / 100)).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="generate-button">Generate Invoice</button>
        </form>
      </div>
      
      {invoiceData && (
        <div className="preview-container">
          <InvoicePreview invoiceData={invoiceData} />
        </div>
      )}
    </div>
  );
};

export default InvoiceForm; 