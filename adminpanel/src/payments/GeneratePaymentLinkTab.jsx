import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import * as Ds from '../components/ui';
import {
  IconLink,
  IconCopy,
  IconCheck,
  IconExternalLink,
  IconUser,
  IconMail,
  IconRefresh,
  IconTrash,
  IconCalendarPlus,
  IconCoin
} from '@tabler/icons-react';

export default function GeneratePaymentLinkTab({ users = [] }) {
  const [recipientType, setRecipientType] = useState('member');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [paymentType, setPaymentType] = useState('membership');
  const [amount, setAmount] = useState('15000');
  const [reason, setReason] = useState('Annual Membership Fee');
  const [sendEmail, setSendEmail] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Links history states
  const [generatedLinks, setGeneratedLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchLinks = useCallback(async () => {
    setLinksLoading(true);
    try {
      const data = await api.listGeneratedLinks();
      setGeneratedLinks(data || []);
    } catch (err) {
      console.error('Failed to fetch generated links:', err);
    } finally {
      setLinksLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  useEffect(() => {
    if (recipientType === 'member' && userId) {
      const selectedUser = users.find(u => u.id === userId);
      if (selectedUser) {
        setEmail(selectedUser.email || '');
        setFullName(selectedUser.full_name || '');
      }
    }
  }, [userId, recipientType, users]);

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
    if (type === 'membership') {
      setAmount('15000');
      setReason('Annual Membership Fee');
    } else if (type === 'meeting_fee') {
      setAmount('6000');
      setReason('Forum Meeting & Event Ticket Fee');
    } else if (type === 'renewal') {
      setAmount('15000');
      setReason('Annual Membership Renewal Fee');
    } else {
      setAmount('');
      setReason('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (recipientType === 'member' && !userId) {
      return setError('Please select a member from the list.');
    }
    if (recipientType === 'custom' && !email) {
      return setError('Please enter a recipient email address.');
    }
    if (!amount || parseFloat(amount) <= 0) {
      return setError('Please enter a valid billing amount.');
    }

    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const payload = {
        user_id: recipientType === 'member' && userId ? userId : null,
        email: email || null,
        full_name: fullName || null,
        payment_type: paymentType,
        amount: parseFloat(amount),
        reason,
        send_email: sendEmail
      };

      const res = await api.generatePaymentLink(payload);
      setResult(res);
      fetchLinks(); // Refresh history list
    } catch (err) {
      setError(err.message || 'Failed to generate payment link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleReset = () => {
    setResult(null);
    setCopied(false);
    setError('');
  };

  const handleRevoke = async (proofId) => {
    if (!window.confirm('Are you sure you want to revoke/expire this payment link immediately?')) return;
    setActionLoadingId(proofId);
    try {
      await api.revokeGeneratedLink(proofId);
      await fetchLinks();
    } catch (err) {
      alert(err.message || 'Failed to revoke payment link');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleExtend = async (proofId) => {
    setActionLoadingId(proofId);
    try {
      await api.extendGeneratedLink(proofId, 7); // Extend by 7 days
      await fetchLinks();
    } catch (err) {
      alert(err.message || 'Failed to extend payment link');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getLinkStatusBadge = (link) => {
    if (link.status === 'completed') {
      return <Ds.Badge variant="success">Paid / Converted</Ds.Badge>;
    } else if (link.status === 'expired') {
      return <Ds.Badge variant="danger">Expired</Ds.Badge>;
    } else {
      const diffMs = new Date(link.expires_at) - new Date();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        return <Ds.Badge variant="danger">Expired</Ds.Badge>;
      } else if (diffDays === 1) {
        return <Ds.Badge variant="warning">Expires Tomorrow</Ds.Badge>;
      } else {
        return <Ds.Badge variant="warning">Expires in {diffDays}d</Ds.Badge>;
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── Link Generator Section ── */}
      <Ds.Section
        title="Generate Payment Link"
        subtitle="Create direct checkout links for members or custom prospects. The generated link allows secure online card payment or bank proof upload."
      >
        {!result ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {error && (
              <div style={{
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-semibold)'
              }}>
                {error}
              </div>
            )}

            {/* Recipient Type Toggle */}
            <div className="ds-field">
              <label className="ds-label">Recipient Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <button
                  type="button"
                  onClick={() => { setRecipientType('member'); setError(''); }}
                  style={{
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    border: recipientType === 'member'
                      ? '2px solid var(--brand-blue)'
                      : '1px solid var(--border-default)',
                    background: recipientType === 'member'
                      ? 'var(--brand-blue-50)'
                      : 'var(--bg-surface)',
                    color: recipientType === 'member'
                      ? 'var(--brand-blue)'
                      : 'var(--fg-primary)',
                    fontWeight: 'var(--weight-semibold)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-2)',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <IconUser size={16} /> Existing Member / Prospect
                </button>
                <button
                  type="button"
                  onClick={() => { setRecipientType('custom'); setError(''); }}
                  style={{
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    border: recipientType === 'custom'
                      ? '2px solid var(--brand-blue)'
                      : '1px solid var(--border-default)',
                    background: recipientType === 'custom'
                      ? 'var(--brand-blue-50)'
                      : 'var(--bg-surface)',
                    color: recipientType === 'custom'
                      ? 'var(--brand-blue)'
                      : 'var(--fg-primary)',
                    fontWeight: 'var(--weight-semibold)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-2)',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <IconMail size={16} /> Custom Recipient (Email)
                </button>
              </div>
            </div>

            {/* Recipient Details */}
            {recipientType === 'member' ? (
              <div className="ds-field">
                <label className="ds-label ds-label--required">Select Member</label>
                <Ds.Select
                  value={userId}
                  options={users.map(u => ({ id: u.id, name: `${u.full_name || 'Unnamed'} (${u.email || u.phone_number})` }))}
                  onChange={setUserId}
                  placeholder="Search or select member..."
                  searchable
                />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="ds-field">
                  <label className="ds-label ds-label--required">Recipient Email</label>
                  <Ds.Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="ds-field">
                  <label className="ds-label">Recipient Name (Optional)</label>
                  <Ds.Input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Fee Category & Amount */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="ds-field">
                <label className="ds-label">Fee Category</label>
                <Ds.Select
                  value={paymentType}
                  options={[
                    { id: 'membership', name: 'Annual Membership Fee' },
                    { id: 'meeting_fee', name: 'Meeting / Event Ticket Fee' },
                    { id: 'renewal', name: 'Annual Renewal Fee' },
                    { id: 'other', name: 'Other / Custom' }
                  ]}
                  onChange={handlePaymentTypeChange}
                  placeholder="Select category..."
                />
              </div>
              <div className="ds-field">
                <label className="ds-label ds-label--required">Billing Amount (LKR)</label>
                <Ds.Input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Payment Reason */}
            <div className="ds-field">
              <label className="ds-label ds-label--required">Payment Reason / Description</label>
              <Ds.Input
                type="text"
                placeholder="e.g. Annual Membership Fee 2026"
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              />
            </div>

            {/* Email Checkbox */}
            <label className="form-checkbox-group" htmlFor="send-email-chk" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                id="send-email-chk"
                checked={sendEmail}
                onChange={e => setSendEmail(e.target.checked)}
              />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--fg-primary)', userSelect: 'none' }}>
                Automatically email payment link to recipient
              </span>
            </label>

            {/* Submit Button */}
            <Ds.Button
              type="submit"
              variant="primary"
              loading={loading}
              style={{ width: '100%', height: '44px', fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)' }}
              leftIcon={<IconLink size={18} />}
            >
              Generate Payment Link
            </Ds.Button>
          </form>
        ) : (
          /* ── Result Display ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-4)',
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              color: 'var(--success)',
              borderRadius: 'var(--radius-md)',
            }}>
              <IconCheck size={22} />
              <div>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)' }}>
                  Payment Link Generated Successfully!
                </div>
                {result.email_sent && (
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', marginTop: '2px' }}>
                    An email with the checkout link has been sent to {result.recipient_email}.
                  </div>
                )}
              </div>
            </div>

            {/* Link Box */}
            <div className="ds-field">
              <label className="ds-label">Payment Link URL</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Ds.Input
                  type="text"
                  readOnly
                  value={result.checkout_url}
                  style={{
                    flex: 1,
                    fontFamily: 'monospace',
                    fontSize: 'var(--text-sm)',
                    background: 'var(--bg-subtle)'
                  }}
                />
                <Ds.Button
                  type="button"
                  variant={copied ? 'success' : 'primary'}
                  onClick={() => copyToClipboard(result.checkout_url)}
                  style={{ height: '40px', padding: '0 var(--space-4)', flexShrink: 0 }}
                  leftIcon={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </Ds.Button>
              </div>
            </div>

            {/* Payment Details Summary */}
            <div style={{
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-5)',
              border: '1px solid var(--border-subtle)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-5)'
            }}>
              <div>
                <span className="ds-label" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recipient
                </span>
                <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--fg-primary)', fontSize: 'var(--text-md)', marginTop: '4px' }}>
                  {result.recipient_name || 'Member'}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
                  {result.recipient_email || '—'}
                </div>
              </div>
              <div>
                <span className="ds-label" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Amount & Category
                </span>
                <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--fg-primary)', fontSize: 'var(--text-md)', marginTop: '4px' }}>
                  LKR {parseFloat(result.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', textTransform: 'capitalize' }}>
                  {result.payment_type.replace('_', ' ')}
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span className="ds-label" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Reason
                </span>
                <div style={{ fontWeight: 'var(--weight-medium)', color: 'var(--fg-secondary)', fontSize: 'var(--text-base)', marginTop: '4px' }}>
                  {result.reason}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <a
                href={result.checkout_url}
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1, textDecoration: 'none' }}
              >
                <Ds.Button
                  variant="primary"
                  style={{ width: '100%', height: '42px' }}
                  leftIcon={<IconExternalLink size={16} />}
                >
                  Open Payment Page
                </Ds.Button>
              </a>
              <Ds.Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                style={{ height: '42px' }}
                leftIcon={<IconRefresh size={16} />}
              >
                Generate Another Link
              </Ds.Button>
            </div>
          </div>
        )}
      </Ds.Section>

      {/* ── Generated Links History Section ── */}
      <Ds.Section title="Generated Links History" flush>
        <Ds.Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Recipient</th>
              <th>Reason</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Expires</th>
              <th>Status</th>
              <th className="ds-table__actions" />
            </tr>
          </thead>
          <tbody>
            {linksLoading ? (
              <Ds.Table.LoadingRow colSpan={8} label="Loading link history…" />
            ) : generatedLinks.length === 0 ? (
              <Ds.Table.EmptyRow
                colSpan={8}
                icon={IconCoin}
                title="No generated links"
                description="Payment links you create will appear here."
              />
            ) : generatedLinks.map(link => (
              <tr key={link.proof_id}>
                <td className="ds-table__muted">
                  {new Date(link.created_at).toLocaleDateString()}
                </td>
                <td>
                  <div className="ds-table__primary">{link.recipient_name || 'Prospect'}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontWeight: 'var(--weight-medium)' }}>
                    {link.recipient_email || '—'}
                  </div>
                </td>
                <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="ds-table__muted">
                  {link.payment_reason || '—'}
                </td>
                <td>
                  <Ds.Badge variant="neutral">{link.payment_type}</Ds.Badge>
                </td>
                <td className="ds-table__primary" style={{ fontWeight: 'var(--weight-bold)' }}>
                  LKR {parseFloat(link.payment_amount).toLocaleString()}
                </td>
                <td style={{ fontSize: 'var(--text-xs)' }} className="ds-table__muted">
                  {new Date(link.expires_at).toLocaleDateString()}
                </td>
                <td>
                  {getLinkStatusBadge(link)}
                </td>
                <td className="ds-table__actions">
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <Ds.Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyToClipboard(link.checkout_url)}
                      style={{ padding: '0 8px', height: '30px' }}
                      title="Copy Checkout Link"
                    >
                      <IconCopy size={14} />
                    </Ds.Button>
                    <a href={link.checkout_url} target="_blank" rel="noreferrer">
                      <Ds.Button
                        size="sm"
                        variant="secondary"
                        style={{ padding: '0 8px', height: '30px' }}
                        title="Open Checkout Page"
                      >
                        <IconExternalLink size={14} />
                      </Ds.Button>
                    </a>
                    {(link.status === 'pending' || link.status === 'expired') && (
                      <Ds.Button
                        size="sm"
                        variant="secondary"
                        loading={actionLoadingId === link.proof_id}
                        onClick={() => handleExtend(link.proof_id)}
                        style={{ padding: '0 8px', height: '30px' }}
                        title="Extend Expiry by 7 Days"
                      >
                        <IconCalendarPlus size={14} />
                      </Ds.Button>
                    )}
                    {link.status === 'pending' && (
                      <Ds.Button
                        size="sm"
                        variant="danger"
                        loading={actionLoadingId === link.proof_id}
                        onClick={() => handleRevoke(link.proof_id)}
                        style={{ padding: '0 8px', height: '30px' }}
                        title="Revoke / Expire Link"
                      >
                        <IconTrash size={14} />
                      </Ds.Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Ds.Table>
      </Ds.Section>

    </div>
  );
}
