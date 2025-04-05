import React, { useRef } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './InvoicePreview.css';
import anandRoadlinesLogo from '../assets/images/new-anand-roadlines-high-resolution-logo-final.png';
import saiBabaLogo from '../assets/images/sai-baba.jpg';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  column: {
    flexDirection: 'column',
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    color: '#555555',
  },
  value: {
    fontSize: 14,
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 15,
  },
  description: {
    marginVertical: 15,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  tableContainer: {
    marginVertical: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid',
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid',
    paddingVertical: 8,
  },
  tableCell: {
    fontSize: 12,
  },
  colDescription: {
    width: '40%',
  },
  colQuantity: {
    width: '20%',
    textAlign: 'center',
  },
  colPrice: {
    width: '20%',
    textAlign: 'right',
  },
  colTotal: {
    width: '20%',
    textAlign: 'right',
  },
});

// Replace paths for GitHub Pages
const PUBLIC_URL = process.env.PUBLIC_URL || '';

// Enhanced PDF Document Component
const InvoicePDF = ({ invoiceData }) => {
  // Calculate total amount with tax
  const subtotal = parseFloat(invoiceData.amount) || 
    (invoiceData.items ? invoiceData.items.reduce((sum, item) => sum + (parseFloat(item.price) * parseFloat(item.quantity || 1)), 0) : 0);
  const taxAmount = (subtotal * parseFloat(invoiceData.taxRate)) / 100;
  const total = subtotal + taxAmount;

  // Format currency based on selection
  const formatCurrency = (amount, currency) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹'
    };
    return `${symbols[currency] || '$'}${amount.toFixed(2)}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <Image src={saiBabaLogo} style={{ width: 70, height: 70, className: 'sai-baba-logo', marginRight: 10 }} />
          <Image src={anandRoadlinesLogo} style={{ className: 'company-logo', width: 120 }} />
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#CCCCCC', paddingBottom: 10 }}>
          <Text style={{ fontSize: 10 }}>GST: {invoiceData.gst || 'XX-XXXXX-XXXX'}</Text>
          <Text style={{ fontSize: 10 }}>PAN: {invoiceData.pan || 'XXXXXXXXXX'}</Text>
          <Text style={{ fontSize: 10 }}>Truck No: {invoiceData.truckNumber || 'XX-XX-XXXX'}</Text>
        </View>
        
        <Text style={styles.header}>INVOICE</Text>
        
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.subheader}>From:</Text>
            <Text style={styles.value}>{invoiceData.fromCompany}</Text>
            <Text style={styles.value}>{invoiceData.fromAddress}</Text>
            <Text style={styles.value}>{invoiceData.fromEmail}</Text>
            <Text style={styles.value}>{invoiceData.fromPhone}</Text>
          </View>
          
          <View style={styles.column}>
            <Text style={styles.subheader}>To:</Text>
            <Text style={styles.value}>{invoiceData.toCompany}</Text>
            <Text style={styles.value}>{invoiceData.toAddress}</Text>
            <Text style={styles.value}>{invoiceData.toEmail}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.value}>{invoiceData.invoiceId}</Text>
          </View>
          
          <View style={styles.column}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{invoiceData.date}</Text>
          </View>
          
          <View style={styles.column}>
            <Text style={styles.label}>Payment Terms:</Text>
            <Text style={styles.value}>{invoiceData.paymentTerms}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        {/* Items Table */}
        {invoiceData.items && invoiceData.items.length > 0 ? (
          <View style={styles.tableContainer}>
            <Text style={styles.subheader}>Items:</Text>
            
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.colDescription]}>Description</Text>
              <Text style={[styles.tableCell, styles.colQuantity]}>Quantity</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>Price</Text>
              <Text style={[styles.tableCell, styles.colTotal]}>Total</Text>
            </View>
            
            {invoiceData.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colDescription]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.colQuantity]}>{item.quantity || 1}</Text>
                <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(parseFloat(item.price), invoiceData.currency)}</Text>
                <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrency(parseFloat(item.price) * parseFloat(item.quantity || 1), invoiceData.currency)}</Text>
              </View>
            ))}
            
            <View style={styles.divider} />
          </View>
        ) : (
          <View style={styles.description}>
            <Text style={styles.subheader}>Description:</Text>
            <Text style={styles.value}>{invoiceData.description}</Text>
            <View style={styles.divider} />
          </View>
        )}
        
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>{formatCurrency(subtotal, invoiceData.currency)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Tax ({invoiceData.taxRate}%):</Text>
          <Text style={styles.value}>{formatCurrency(taxAmount, invoiceData.currency)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.total}>Total:</Text>
          <Text style={styles.total}>{formatCurrency(total, invoiceData.currency)}</Text>
        </View>
      </Page>
    </Document>
  );
};

const InvoicePreview = ({ invoiceData }) => {
  const invoiceRef = useRef(null);
  
  // Calculate total amount with tax
  const subtotal = parseFloat(invoiceData.amount) || 
    (invoiceData.items ? invoiceData.items.reduce((sum, item) => sum + (parseFloat(item.price) * parseFloat(item.quantity || 1)), 0) : 0);
  const taxAmount = (subtotal * parseFloat(invoiceData.taxRate)) / 100;
  const total = subtotal + taxAmount;

  // Format currency based on selection
  const formatCurrency = (amount, currency) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹'
    };
    return `${symbols[currency] || '$'}${amount.toFixed(2)}`;
  };
  
  // Function to manually generate PDF
  const generatePDF = () => {
    // Get the invoice element
    const invoice = invoiceRef.current;
    
    // Use html2canvas to convert the element to a canvas with lower scale for smaller file size
    html2canvas(invoice, { 
      scale: 1.5, // Lower scale for better compression (default is 2)
      logging: false,
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with 70% quality instead of PNG
      const pdf = new jsPDF('p', 'mm', 'a4', true); // Enable compression
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio, '', 'FAST');
      pdf.save(`invoice_${invoiceData.invoiceId}.pdf`);
    });
  };
  
  return (
    <div className="invoice-preview">
      <h2>Invoice Preview</h2>
      
      <div ref={invoiceRef} className="invoice">
        <div className="invoice-header">
          <div className="logo-container" style={{ display: 'flex', marginBottom: '20px' }}>
            <img src={saiBabaLogo} alt="Sai Baba Logo" className="sai-baba-logo" style={{ width: '70px', height: '70px', marginRight: '10px' }} />
            <img src={anandRoadlinesLogo} alt="Anand Roadlines Logo" className="company-logo" style={{ width: '120px' }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #CCCCCC', paddingBottom: '10px' }}>
            <span style={{ fontSize: '12px' }}>GST: {invoiceData.gst || 'XX-XXXXX-XXXX'}</span>
            <span style={{ fontSize: '12px' }}>PAN: {invoiceData.pan || 'XXXXXXXXXX'}</span>
            <span style={{ fontSize: '12px' }}>Truck No: {invoiceData.truckNumber || 'XX-XX-XXXX'}</span>
          </div>
          
          <h1>INVOICE</h1>
        </div>
        
        <div className="invoice-info">
          <div className="from-info">
            <h3>From:</h3>
            <p>{invoiceData.fromCompany}</p>
            <p className="address">{invoiceData.fromAddress}</p>
            <p>{invoiceData.fromEmail}</p>
            <p>{invoiceData.fromPhone}</p>
          </div>
          
          <div className="to-info">
            <h3>To:</h3>
            <p>{invoiceData.toCompany}</p>
            <p className="address">{invoiceData.toAddress}</p>
            <p>{invoiceData.toEmail}</p>
          </div>
        </div>
        
        <div className="invoice-details">
          <div className="detail">
            <span className="label">Invoice Number:</span>
            <span className="value">{invoiceData.invoiceId}</span>
          </div>
          
          <div className="detail">
            <span className="label">Date:</span>
            <span className="value">{invoiceData.date}</span>
          </div>
          
          <div className="detail">
            <span className="label">Payment Terms:</span>
            <span className="value">{invoiceData.paymentTerms}</span>
          </div>
        </div>
        
        {/* Items Table or Description */}
        {invoiceData.items && invoiceData.items.length > 0 ? (
          <div className="items-section">
            <h3>Items:</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td className="text-center">{item.quantity || 1}</td>
                    <td className="text-right">{formatCurrency(parseFloat(item.price), invoiceData.currency)}</td>
                    <td className="text-right">{formatCurrency(parseFloat(item.price) * parseFloat(item.quantity || 1), invoiceData.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="description-section">
            <h3>Description:</h3>
            <p>{invoiceData.description}</p>
          </div>
        )}
        
        <div className="amounts-section">
          <div className="amount-row">
            <span className="label">Subtotal:</span>
            <span className="value">{formatCurrency(subtotal, invoiceData.currency)}</span>
          </div>
          
          <div className="amount-row">
            <span className="label">Tax ({invoiceData.taxRate}%):</span>
            <span className="value">{formatCurrency(taxAmount, invoiceData.currency)}</span>
          </div>
          
          <div className="amount-row total">
            <span className="label">Total:</span>
            <span className="value">{formatCurrency(total, invoiceData.currency)}</span>
          </div>
        </div>
      </div>
      
      <div className="pdf-actions">
        <button onClick={generatePDF} className="download-btn">Download PDF</button>
      </div>
    </div>
  );
};

export default InvoicePreview; 