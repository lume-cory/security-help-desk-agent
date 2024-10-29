'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ExternalLink, Check, X, MessageSquare, Mail, Ticket } from 'lucide-react'

interface Question {
  id: number;
  question: string;
  user: string;
  stage: string;
  source: string;
  sourceLink: string;
}

interface OutstandingQuestion extends Question {
  dueDate: string;
  suggestedResponse: string;
  supportingDocs: Array<{ name: string; link: string }>;
  otherDocs: Array<{ name: string; link: string }>;
  policyOwner: PolicyOwner;
}

interface ResolvedQuestion extends Question {
  resolvedDate: string;
  response: string;
  decision: string;
  documentationLink: string;
  policyOwner: PolicyOwner;
}

type PolicyOwner = {
  team: string
  teamEmail: string
  contact: string
  email: string
}

const outstandingQuestions: OutstandingQuestion[] = [
  {
    id: 1,
    question: "What are the security implications of using a third-party authentication service?",
    user: "John Doe",
    stage: "Architecture Review",
    dueDate: "2023-07-15",
    policyOwner: {
      team: "Identity & Access Management Team",
      teamEmail: "iam@company.com",
      contact: "Maya Patel",
      email: "maya.patel@company.com"
    },
    suggestedResponse: "Using a third-party authentication service can have both benefits and risks. Benefits include reduced development time and potentially more robust security measures. However, risks include potential data breaches at the third-party provider, loss of control over the authentication process, and potential service outages. It's crucial to thoroughly vet the provider, understand their security measures, and have contingency plans in place.",
    supportingDocs: [
      { name: "Security Policy #AUTH-001", link: "https://docs.company.com/security/AUTH-001" },
      { name: "Prior Review #PR-789", link: "https://reviews.company.com/PR-789" }
    ],
    otherDocs: [
      { name: "User Authentication Flow", link: "https://docs.company.com/auth/flow" },
      { name: "Third-Party Integration Guidelines", link: "https://docs.company.com/integration/guidelines" }
    ],
    source: "Slack #ask-security channel",
    sourceLink: "https://slack.com/archives/C01234567/p1623456789000200"
  },
  {
    id: 2,
    question: "I want to host a website for our team project. Can I register a .org domain and set it up myself?",
    user: "Sarah Chen",
    stage: "Planning",
    dueDate: "2023-07-20",
    policyOwner: {
      team: "Infrastructure Security Team",
      teamEmail: "infrasec@company.com",
      contact: "Chris Martinez",
      email: "chris.martinez@company.com"
    },
    suggestedResponse: "All external websites must go through our Website Governance Process. This includes domain registration (which must be done through IT), security assessment of the hosting platform, and compliance review. Please submit a Website Request Form to initiate this process. Self-hosted solutions are not permitted due to security and maintenance concerns.",
    supportingDocs: [
      { name: "Website Governance Policy", link: "https://docs.company.com/security/WEB-001" },
      { name: "Domain Management Guidelines", link: "https://docs.company.com/it/domains" }
    ],
    otherDocs: [
      { name: "Cloud Hosting Standards", link: "https://docs.company.com/cloud/standards" },
      { name: "Website Request Form", link: "https://forms.company.com/website-request" }
    ],
    source: "Email to security-helpdesk alias",
    sourceLink: "https://mail.company.com/threads/website-inquiry-july12"
  },
  {
    id: 3,
    question: "I'm traveling to Mexico next week for the conference. Can I bring my work phone?",
    user: "Michael Rodriguez",
    stage: "Pre-travel",
    dueDate: "2023-07-14",
    policyOwner: {
      team: "Physical Security & Travel Team",
      teamEmail: "travelsec@company.com",
      contact: "Sarah O'Connor",
      email: "sarah.oconnor@company.com"
    },
    suggestedResponse: "Yes, you can bring your work phone to Mexico, but specific security measures are required. You must: 1) Enable full disk encryption, 2) Install our travel VPN profile, 3) Enable remote wipe capability, and 4) Register your travel in the Travel Security Portal. Avoid using public WiFi and consider a travel burner phone for personal use.",
    supportingDocs: [
      { name: "International Travel Security Policy", link: "https://docs.company.com/security/TRAVEL-002" },
      { name: "Device Protection Guidelines", link: "https://docs.company.com/security/devices" }
    ],
    otherDocs: [
      { name: "VPN Configuration Guide", link: "https://docs.company.com/vpn/setup" },
      { name: "Country-Specific Security Advisories", link: "https://docs.company.com/security/advisories" }
    ],
    source: "Slack #ask-security channel",
    sourceLink: "https://slack.com/archives/C01234567/p1623456789000400"
  },
  {
    id: 4,
    question: "Our team needs to share some sensitive financial documents with external auditors.",
    user: "Alex Kumar",
    stage: "Planning",
    dueDate: "2023-07-18",
    policyOwner: {
      team: "Data Protection Team",
      teamEmail: "dataprotection@company.com",
      contact: "James Wilson",
      email: "james.wilson@company.com"
    },
    suggestedResponse: "External file sharing must use our approved secure file transfer solution (SecureShare). You'll need to: 1) Request access through IT Service Portal, 2) Complete the External Sharing Agreement form, 3) Use time-limited links (max 7 days), and 4) Enable download tracking. All shared documents must be logged in the Data Sharing Register.",
    supportingDocs: [
      { name: "External Data Sharing Policy", link: "https://docs.company.com/security/DATA-002" },
      { name: "Auditor Security Requirements", link: "https://docs.company.com/security/audit-requirements" }
    ],
    otherDocs: [
      { name: "SecureShare User Guide", link: "https://docs.company.com/tools/secureshare" },
      { name: "Data Classification Guidelines", link: "https://docs.company.com/security/data-classification" }
    ],
    source: "Email to security-helpdesk alias",
    sourceLink: "https://mail.company.com/threads/external-sharing-query"
  },
  {
    id: 5,
    question: "We're hiring contractors next week and need to get them laptop access.",
    user: "Patricia Wong",
    stage: "Onboarding",
    dueDate: "2023-07-13",
    policyOwner: {
      team: "Identity & Access Management Team",
      teamEmail: "iam@company.com",
      contact: "Maya Patel",
      email: "maya.patel@company.com"
    },
    suggestedResponse: "Contractor device access requires: 1) Completed Contractor Security Agreement, 2) Background check confirmation from HR, 3) Completion of Security Awareness Training, 4) Device must be company-issued or meet our BYOD requirements. Submit requests through Contractor Access Portal at least 3 business days before start date.",
    supportingDocs: [
      { name: "Contractor Security Policy", link: "https://docs.company.com/security/CONTRACTOR-001" },
      { name: "Device Access Requirements", link: "https://docs.company.com/security/device-access" }
    ],
    otherDocs: [
      { name: "BYOD Guidelines", link: "https://docs.company.com/security/byod" },
      { name: "Security Training Portal", link: "https://training.company.com/security" }
    ],
    source: "Slack #ask-security channel",
    sourceLink: "https://slack.com/archives/C01234567/p1623456789000500"
  },
  {
    id: 6,
    question: "Can we use personal LastPass accounts to share team credentials?",
    user: "Tom Mitchell",
    stage: "Operations",
    dueDate: "2023-07-16",
    policyOwner: {
      team: "Identity & Access Management Team",
      teamEmail: "iam@company.com",
      contact: "Maya Patel",
      email: "maya.patel@company.com"
    },
    suggestedResponse: "No, personal password managers cannot be used for company credentials under any circumstances. This violates our security policy and creates significant risks. For temporary credential sharing, use the approved interim solution (KeyPass with encrypted file on approved share). Enterprise password manager rollout is scheduled for completion in 2 weeks.",
    supportingDocs: [
      { name: "Password Management Policy", link: "https://docs.company.com/security/PASS-001" },
      { name: "Credential Sharing Guidelines", link: "https://docs.company.com/security/cred-sharing" }
    ],
    otherDocs: [
      { name: "Enterprise Password Manager Rollout Plan", link: "https://docs.company.com/projects/password-manager" },
      { name: "Approved Tools List", link: "https://docs.company.com/security/approved-tools" }
    ],
    source: "Zendesk ticket",
    sourceLink: "https://zendesk.company.com/tickets/SEC-2023-789"
  }
]

const resolvedQuestions: ResolvedQuestion[] = [
  {
    id: 1,
    question: "What is our policy on password complexity?",
    user: "Alice Johnson",
    stage: "Implementation",
    resolvedDate: "2023-06-30",
    response: "Our password policy requires a minimum of 12 characters, including uppercase and lowercase letters, numbers, and special characters. We also implement a password strength meter to encourage even stronger passwords.",
    decision: "Implemented in User Authentication Module",
    documentationLink: "/security/policies/password-policy",
    source: "Security review ticket",
    sourceLink: "https://jira.company.com/browse/SEC-001",
    policyOwner: {
      team: "Identity & Access Management Team",
      teamEmail: "iam@company.com",
      contact: "Maya Patel",
      email: "maya.patel@company.com"
    }
  },
  {
    id: 2,
    question: "How often should we conduct security audits?",
    user: "Bob Williams",
    stage: "Operations",
    resolvedDate: "2023-06-25",
    response: "We conduct comprehensive security audits on a quarterly basis, with continuous monitoring and smaller checks performed weekly. This schedule balances thorough review with operational efficiency.",
    decision: "Added to Security Operations Calendar",
    documentationLink: "/security/operations/audit-schedule",
    source: "Slack #ask-security channel",
    sourceLink: "https://slack.com/archives/C01234567/p1623456789000300",
    policyOwner: {
      team: "Identity & Access Management Team",
      teamEmail: "iam@company.com",
      contact: "Maya Patel",
      email: "maya.patel@company.com"
    }
  },
  {
    id: 3,
    question: "Can I use my personal iPhone to access work email while on vacation?",
    user: "Maria Garcia",
    stage: "Access Management",
    resolvedDate: "2023-07-01",
    response: "Yes, you can access work email on personal iOS devices if they meet our BYOD requirements: 1) Latest iOS version, 2) Device passcode enabled, 3) Installation of our MDM profile, 4) Acceptance of remote wipe capability. Install our Mobile Access Portal app to get started.",
    decision: "Approved with standard BYOD controls",
    documentationLink: "/security/byod/mobile-access",
    source: "Email to security-helpdesk",
    sourceLink: "https://mail.company.com/threads/mobile-access-request",
    policyOwner: {
      team: "Identity & Access Management Team",
      teamEmail: "iam@company.com",
      contact: "Maya Patel",
      email: "maya.patel@company.com"
    }
  },
  {
    id: 4,
    question: "Lost my laptop in a taxi - what do I need to do immediately?",
    user: "David Chen",
    stage: "Incident Response",
    resolvedDate: "2023-07-05",
    response: "Remote wipe initiated within 15 minutes of report. Device tracking enabled. User credentials reset. New laptop issued with restored backup from previous day. Incident report filed and no sensitive data was compromised due to disk encryption.",
    decision: "Incident closed - no data breach",
    documentationLink: "/security/incidents/LOST-2023-45",
    source: "Emergency hotline",
    sourceLink: "https://incidents.company.com/LOST-2023-45",
    policyOwner: {
      team: "Identity & Access Management Team",
      teamEmail: "iam@company.com",
      contact: "Maya Patel",
      email: "maya.patel@company.com"
    }
  },
  {
    id: 5,
    question: "Need approval for using Zoom with external clients - is this allowed?",
    user: "Rachel Thompson",
    stage: "Software Approval",
    resolvedDate: "2023-07-02",
    response: "Zoom is approved for external client meetings with required settings: SSO authentication, waiting rooms enabled, meeting passwords required, cloud recording disabled. Use company Zoom account only, not personal.",
    decision: "Approved with security controls",
    documentationLink: "/security/approved-software/video-conferencing",
    source: "Zendesk ticket",
    sourceLink: "https://zendesk.company.com/tickets/SEC-2023-089",
    policyOwner: {
      team: "Identity & Access Management Team",
      teamEmail: "iam@company.com",
      contact: "Maya Patel",
      email: "maya.patel@company.com"
    }
  },
  {
    id: 6,
    question: "Received suspicious email claiming to be from CEO - what should I do?",
    user: "James Wilson",
    stage: "Phishing Report",
    resolvedDate: "2023-07-08",
    response: "Confirmed phishing attempt. Email reported to security team, blocked sender domain, updated email filters. All employees notified of phishing campaign. Reminder sent about CEO impersonation red flags.",
    decision: "Phishing attempt blocked and documented",
    documentationLink: "/security/incidents/PHISH-2023-12",
    source: "Phishing report button",
    sourceLink: "https://phishing.company.com/reports/2023-12",
    policyOwner: {
      team: "Identity & Access Management Team",
      teamEmail: "iam@company.com",
      contact: "Maya Patel",
      email: "maya.patel@company.com"
    }
  },
  {
    id: 7,
    question: "Do we need to encrypt USB drives used in the office?",
    user: "Emma Davis",
    stage: "Policy Clarification",
    resolvedDate: "2023-07-03",
    response: "Yes, all removable storage devices must use hardware encryption. Only company-issued encrypted USB drives are permitted. Available from IT with department manager approval. Personal USB devices are not allowed.",
    decision: "Policy reinforced - no exceptions",
    documentationLink: "/security/policies/removable-media",
    source: "Slack #ask-security channel",
    sourceLink: "https://slack.com/archives/C01234567/p1623456789000400",
    policyOwner: {
      team: "Identity & Access Management Team",
      teamEmail: "iam@company.com",
      contact: "Maya Patel",
      email: "maya.patel@company.com"
    }
  }
]

interface ConfirmedAssociations {
  [questionId: number]: {
    [docName: string]: boolean;
  };
}

export function QuestionsTable() {
  const [showResolved, setShowResolved] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<OutstandingQuestion | ResolvedQuestion | null>(null)
  const [response, setResponse] = useState('')
  const [confirmedAssociations, setConfirmedAssociations] = useState<ConfirmedAssociations>({})

  const questions = showResolved ? resolvedQuestions : outstandingQuestions

  const handleUseResponse = () => {
    if (selectedQuestion && 'suggestedResponse' in selectedQuestion) {
      setResponse(selectedQuestion.suggestedResponse)
    }
  }

  const handleModifyResponse = () => {
    if (selectedQuestion && 'suggestedResponse' in selectedQuestion) {
      setResponse(selectedQuestion.suggestedResponse)
    }
  }

  const handleConfirmAssociation = (questionId: number, docName: string, isAssociated: boolean) => {
    setConfirmedAssociations(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [docName]: isAssociated
      }
    }))
    // Here you would typically send this information back to your AI model or backend
    console.log(`Document "${docName}" is ${isAssociated ? '' : 'not '}associated with question ${questionId}`)
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Slack #ask-security channel':
        return <MessageSquare className="h-4 w-4 mr-2" />
      case 'Email to security-review alias':
        return <Mail className="h-4 w-4 mr-2" />
      case 'Security review ticket':
        return <Ticket className="h-4 w-4 mr-2" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Security Review Questions</h2>
        <div className="flex rounded-md shadow-sm" role="group">
          <Button
            variant={!showResolved ? "default" : "outline"}
            className="rounded-l-md"
            onClick={() => setShowResolved(false)}
          >
            Outstanding
          </Button>
          <Button
            variant={showResolved ? "default" : "outline"}
            className="rounded-r-md"
            onClick={() => setShowResolved(true)}
          >
            Resolved
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>{showResolved ? 'Resolved Date' : 'Due Date'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id} className="cursor-pointer hover:bg-muted" onClick={() => setSelectedQuestion(question)}>
              <TableCell>{question.question}</TableCell>
              <TableCell>{question.user}</TableCell>
              <TableCell>{question.stage}</TableCell>
              <TableCell>
                {'resolvedDate' in question ? question.resolvedDate : question.dueDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedQuestion && (
        <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{selectedQuestion.question}</DialogTitle>
              <DialogDescription>Review and respond to this security question</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Submitted by:</Label>
                <span className="col-span-3">{selectedQuestion.user}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Stage:</Label>
                <span className="col-span-3">{selectedQuestion.stage}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{showResolved ? 'Resolved on:' : 'Due by:'}</Label>
                <span className="col-span-3">
                  {showResolved ? 
                    ('resolvedDate' in selectedQuestion ? selectedQuestion.resolvedDate : '') : 
                    ('dueDate' in selectedQuestion ? selectedQuestion.dueDate : '')}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Source:</Label>
                <div className="col-span-3 flex items-center">
                  {getSourceIcon(selectedQuestion.source)}
                  <a href={selectedQuestion.sourceLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                    {selectedQuestion.source}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
              {!showResolved && (
                <>
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right font-semibold self-start pt-1">Policy Owner:</Label>
                      <div className="col-span-3 space-y-2">
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Team</label>
                          <p>
                            {selectedQuestion.policyOwner.team} (
                            <a href={`mailto:${selectedQuestion.policyOwner.teamEmail}`} className="text-blue-600 hover:underline">
                              {selectedQuestion.policyOwner.teamEmail}
                            </a>)
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Contact</label>
                          <p>
                            {selectedQuestion.policyOwner.contact} (
                            <a href={`mailto:${selectedQuestion.policyOwner.email}`} className="text-blue-600 hover:underline">
                              {selectedQuestion.policyOwner.email}
                            </a>)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-semibold self-start pt-1">Suggested Response:</Label>
                    <div className="col-span-3 space-y-2">
                      {'suggestedResponse' in selectedQuestion && (
                        <>
                          <p>{selectedQuestion.suggestedResponse}</p>
                          <div className="flex space-x-2">
                            <Button onClick={handleUseResponse}>Use This Response</Button>
                            <Button variant="outline" onClick={handleModifyResponse}>Modify Response</Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right self-start pt-1">
                      <span className="font-semibold">Supporting Content:</span>
                      <span className="block text-sm text-gray-500">Content that was referenced to create this response</span>
                    </Label>
                    <div className="col-span-3">
                      {'supportingDocs' in selectedQuestion && selectedQuestion.supportingDocs.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <a href={doc.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                            {doc.name}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right self-start pt-1">
                      <span className="font-semibold">Other Content:</span>
                      <span className="block text-sm text-gray-500">This content may be related, but was not used. Should it be referenced for topics like this in the future?</span>
                    </Label>
                    <div className="col-span-3">
                      {'otherDocs' in selectedQuestion && selectedQuestion.otherDocs.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                          <a href={doc.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                            {doc.name}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant={confirmedAssociations[selectedQuestion.id]?.[doc.name] === true ? "default" : "outline"}
                              onClick={() => handleConfirmAssociation(selectedQuestion.id, doc.name, true)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={confirmedAssociations[selectedQuestion.id]?.[doc.name] === false ? "default" : "outline"}
                              onClick={() => handleConfirmAssociation(selectedQuestion.id, doc.name, false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {showResolved ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Response:</Label>
                    <span className="col-span-3">{'response' in selectedQuestion ? selectedQuestion.response : ''}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Decision:</Label>
                    <span className="col-span-3">{'decision' in selectedQuestion ? selectedQuestion.decision : ''}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Documentation:</Label>
                    {'documentationLink' in selectedQuestion && (
                      <a href={selectedQuestion.documentationLink} className="col-span-3 text-blue-500 hover:underline flex items-center">
                        {selectedQuestion.documentationLink}
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="response" className="font-semibold">Your Response:</Label>
                  <Textarea
                    id="response"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Enter your response here..."
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              {!showResolved && <Button type="submit">Submit Response</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
