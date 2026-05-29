"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TabsList, TabTrigger } from '@/components/ui/Tabs';
import styles from './page.module.css';

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.headerActions}>
          <div style={{ width: '300px' }}>
            <Input placeholder="Search leads by name, email or phone..." />
          </div>
          <Button>Export Leads</Button>
        </div>

        <TabsList>
          <TabTrigger active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Leads</TabTrigger>
          <TabTrigger active={activeTab === 'new'} onClick={() => setActiveTab('new')}>New</TabTrigger>
          <TabTrigger active={activeTab === 'qualified'} onClick={() => setActiveTab('qualified')}>Qualified</TabTrigger>
          <TabTrigger active={activeTab === 'lost'} onClick={() => setActiveTab('lost')}>Lost</TabTrigger>
        </TabsList>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3 className={styles.emptyTitle}>No leads found</h3>
          <p className={styles.emptyDesc}>You haven't captured any leads yet. Connect your channels and set up a Lead Capture form to start seeing them here.</p>
          <Button>Create Lead Form</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
