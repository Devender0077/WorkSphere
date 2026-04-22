import React, { useEffect, useState } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, Mail, Phone, Globe, Pencil, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { STATUS_COLORS } from '@/data/mock';
import { cn } from '@/lib/utils';

const TABS = ['General', 'Job', 'Payroll', 'Documents', 'Setting'];

const Row = ({ label, value }) => (
  <div className="grid grid-cols-2 gap-4 py-2.5">
    <div className="text-[13px] text-muted-foreground">{label}</div>
    <div className="text-[13.5px] font-medium text-foreground">{value || '-'}</div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="rounded-2xl border border-border bg-card p-6">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[16px] font-bold text-foreground">{title}</h3>
      <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"><Pencil className="h-4 w-4" /></button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">{children}</div>
  </div>
);

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState('General');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/employees/${id}`);
        setEmp(data);
      } catch (e) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="min-h-[60vh] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>;
  if (notFound || !emp) return <Navigate to="/employees" replace />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-foreground hover:text-primary mb-4">
        <ArrowLeft className="h-4 w-4" />
        <h1 className="text-[24px] font-bold">Detail Employee</h1>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col items-center text-center">
            {emp.avatar ? (
              <img src={emp.avatar} alt="" className="h-28 w-28 rounded-full object-cover" />
            ) : (
              <div className="h-28 w-28 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[28px] font-bold">{(emp.first_name?.[0]||'')+(emp.last_name?.[0]||'')}</div>
            )}
            <h2 className="mt-4 text-[22px] font-bold text-foreground">{emp.first_name} {emp.last_name}</h2>
            <p className="text-[13px] text-muted-foreground">{emp.title}</p>
            <button className={cn('mt-3 inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-bold uppercase', STATUS_COLORS[emp.status] || '')}>
              {emp.status} <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>
          </div>
          <div className="my-6 border-t border-border" />
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[13.5px] text-foreground"><Mail className="h-4 w-4 text-muted-foreground" />{emp.email}</div>
            <div className="flex items-center gap-3 text-[13.5px] text-foreground"><Phone className="h-4 w-4 text-muted-foreground" />{emp.phone || '-'}</div>
            <div className="flex items-center gap-3 text-[13.5px] text-foreground"><Globe className="h-4 w-4 text-muted-foreground" />GMT +07:00</div>
          </div>
          <div className="my-6 border-t border-border" />
          <div className="space-y-4">
            {[
              { label: 'Department', value: emp.department },
              { label: 'Office', value: emp.office },
              { label: 'Line Manager', value: emp.line_manager || 'Skylar Calzoni', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face' },
            ].map((it) => (
              <button key={it.label} className="w-full flex items-center justify-between text-left">
                <div>
                  <div className="text-[12px] text-muted-foreground">{it.label}</div>
                  <div className="mt-1 inline-flex items-center gap-2 text-[14px] font-semibold text-foreground">
                    {it.avatar && <img src={it.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />}
                    {it.value}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
          <button className="mt-6 w-full h-11 rounded-xl bg-[hsl(var(--navy))] text-white text-[13.5px] font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90">
            Action <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card px-4">
            <div className="flex gap-6 overflow-x-auto">
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={cn('relative py-4 text-[13.5px] font-semibold transition-colors', tab === t ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                  {t}
                  {tab === t && <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {tab === 'General' && (
            <>
              <Section title="Personal Info">
                <div>
                  <Row label="Full Name" value={`${emp.first_name} ${emp.last_name}`} />
                  <Row label="Date of Birth" value={emp.dob} />
                  <Row label="Nationality" value={emp.nationality} />
                  <Row label="Email Address" value={emp.email} />
                  <Row label="Health Insurance" value="Axa Insurance" />
                </div>
                <div>
                  <Row label="Gender" value={emp.gender} />
                  <Row label="Marital Status" value="-" />
                  <Row label="Personal Tax ID" value="-" />
                  <Row label="Social Insurance" value="-" />
                  <Row label="Phone Number" value={emp.phone} />
                </div>
              </Section>
              <Section title="Address">
                <div>
                  <Row label="Primary address" value="Banyumanik Street, Central Java. Semarang Indonesia" />
                  <Row label="Country" value="Indonesia" />
                  <Row label="State/Province" value="Central Java" />
                </div>
                <div>
                  <Row label="City" value="Semarang" />
                  <Row label="Post Code" value="03125" />
                </div>
              </Section>
              <Section title="Emergency Contact">
                <div>
                  <Row label="Full Name" value="Albert Jhonson" />
                  <Row label="Phone Number" value="089839140011" />
                </div>
                <div>
                  <Row label="Relationship" value="Father" />
                  <Row label="Email" value="albert@gmail.com" />
                </div>
              </Section>
            </>
          )}

          {tab === 'Job' && (
            <Section title="Job Information">
              <div>
                <Row label="Job Title" value={emp.title} />
                <Row label="Department" value={emp.department} />
                <Row label="Office" value={emp.office} />
              </div>
              <div>
                <Row label="Employment Type" value="Full-Time" />
                <Row label="Join Date" value={emp.join_date} />
                <Row label="Line Manager" value={emp.line_manager || 'Skylar Calzoni'} />
              </div>
            </Section>
          )}

          {tab === 'Payroll' && (
            <Section title="Payroll">
              <div>
                <Row label="Base Salary" value="IDR 12,000,000" />
                <Row label="Bank" value="BCA" />
                <Row label="Account Number" value="1234567890" />
              </div>
              <div>
                <Row label="Payment Cycle" value="Monthly" />
                <Row label="Currency" value="IDR" />
                <Row label="Tax Status" value="TK/0" />
              </div>
            </Section>
          )}

          {tab === 'Documents' && (
            <Section title="Documents">
              <div>
                <Row label="ID Card" value="uploaded" />
                <Row label="NPWP" value="uploaded" />
              </div>
              <div>
                <Row label="Contract" value="uploaded" />
                <Row label="Offer Letter" value="uploaded" />
              </div>
            </Section>
          )}

          {tab === 'Setting' && (
            <Section title="Settings">
              <div>
                <Row label="2FA Enabled" value="Yes" />
                <Row label="Notifications" value="Email + Push" />
              </div>
              <div>
                <Row label="Language" value="English" />
                <Row label="Timezone" value="GMT +07:00" />
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
