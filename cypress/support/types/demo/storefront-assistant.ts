export type StorefrontAssistantStreamEvent = Record<string, unknown>;

export interface StorefrontAssistantAgent {
  value: string;
  label: string;
}

export interface StorefrontAssistantProduct {
  idProductAbstract: number;
  name: string;
  sku: string;
  url: string;
  price: number;
  priceFormatted: string;
  originalPrice?: number;
  originalPriceFormatted?: string;
  reason: string;
}

export interface StorefrontAssistantRefinement {
  label: string;
  filterArgument: string;
  value: string;
  matchCount?: number;
}

export interface StorefrontAssistantProductResult {
  products: StorefrontAssistantProduct[];
  displayedCount: number;
  refinementChips: StorefrontAssistantRefinement[];
  activeFilters: StorefrontAssistantRefinement[];
  seeAll: {
    totalResults: number;
    queryString: string;
    categoryUrl: string;
  };
}

export interface StorefrontAssistantComparisonResult {
  comparedProducts: Array<Record<string, unknown>>;
  attributeRows: Array<{
    attribute: string;
    values: string[];
    isDifferent: boolean;
  }>;
}

export interface StorefrontAssistantSetupResult {
  products: Array<Record<string, unknown>>;
  totalFormatted: string;
  budgetFormatted: string;
}

export interface StorefrontAssistantChoicesResult {
  question: string;
  choices: string[];
}

export interface StorefrontAssistantPageContext {
  description: string;
  path: string;
  label: string | null;
  pageContext: Record<string, unknown> | null;
  firstPrompt: string;
}

export interface StorefrontAssistantConversation {
  conversationReference: string;
  name: string;
  updatedAtSecondsAgo: number;
}

export interface StorefrontAssistantStoredMessage {
  role: string;
  content: string;
}

export type StorefrontAssistantEndpoint = 'prompt' | 'conversations' | 'messages';

export type StorefrontAssistantCsrfMode = 'valid' | 'invalid' | 'none';

export interface StorefrontAssistantContractCase {
  description: string;
  method: string;
  endpoint: StorefrontAssistantEndpoint;
  query?: string;
  body?: Record<string, unknown>;
  omittedKeys?: string[];
  rawBody?: string;
  contentType?: string;
  messageLength?: number;
  validPngAttachmentCount?: number;
  csrf: StorefrontAssistantCsrfMode;
  expectedStatus: number;
  expectedError?: string;
  expectedDeletedCount?: number;
  expectsConversationList?: boolean;
}

export interface StorefrontAssistantAttachmentFile {
  path: string;
  name: string;
  mediaType: string;
}

export interface StorefrontAssistantClientRejection {
  description: string;
  files: Array<{ fileName: string; mimeType: string; sizeBytes: number }>;
  notice: string;
  acceptedCount: number;
}

export interface StorefrontAssistantGermanTexts {
  trigger: string;
  greeting: string;
  placeholder: string;
  hint: string;
  disclosure: string;
  historyMenuItem: string;
  newConversationMenuItem: string;
  agentLabels: string[];
  emptyMessageError: string;
}

export interface StorefrontAssistantDemoStaticFixtures {
  defaultPassword: string;
  rootUser: {
    username: string;
  };
  customer: {
    email: string;
    firstName: string;
  };
  storeLocalePath: string;
  germanStoreLocalePath: string;
  agents: StorefrontAssistantAgent[];
  defaultPrompts: string[];
  productPrompts: string[];
  productResultPrompt: string;
  productResultNamedPrompt: string;
  product: {
    abstractSku: string;
    name: string;
    path: string;
  };
  pageContexts: StorefrontAssistantPageContext[];
  messages: {
    simple: string;
    multiline: string[];
    products: string;
    pageContextFollowUp: string;
    attachment: string;
  };
  stubbedConversationReferences: {
    text: string;
    products: string;
  };
  contractPayload: Record<string, unknown>;
  streams: {
    text: StorefrontAssistantStreamEvent[];
    reasoning: StorefrontAssistantStreamEvent[];
    error: StorefrontAssistantStreamEvent[];
    deniedTool: StorefrontAssistantStreamEvent[];
    markdown: StorefrontAssistantStreamEvent[];
    cut: StorefrontAssistantStreamEvent[];
  };
  textAnswer: {
    strongText: string;
    linkPath: string;
    plainText: string;
  };
  reasoningText: string;
  reasoningAnswerText: string;
  streamErrorText: string;
  transportFailureError: string;
  deniedToolAnswerText: string;
  xssWindowKey: string;
  productResult: StorefrontAssistantProductResult;
  carouselResult: StorefrontAssistantProductResult;
  productAnswerText: string;
  productAnswerPlainText: string;
  comparisonResult: StorefrontAssistantComparisonResult;
  comparisonDifferentAttribute: string;
  comparisonSameAttribute: string;
  choicesResult: StorefrontAssistantChoicesResult;
  setupResult: StorefrontAssistantSetupResult;
  conversations: StorefrontAssistantConversation[];
  historyMessages: StorefrontAssistantStoredMessage[];
  promptContractCases: StorefrontAssistantContractCase[];
  conversationContractCases: StorefrontAssistantContractCase[];
  guestEndpoints: Array<{
    method: string;
    endpoint: StorefrontAssistantEndpoint;
    query?: string;
    body?: Record<string, unknown>;
  }>;
  guestError: string;
  attachmentFiles: StorefrontAssistantAttachmentFile[];
  extraAttachmentFile: StorefrontAssistantAttachmentFile;
  clientRejections: StorefrontAssistantClientRejection[];
  germanTexts: StorefrontAssistantGermanTexts;
  mobileViewport: {
    width: number;
    height: number;
  };
  realPrompts: {
    discovery: string;
    compareFollowUp: string;
    setup: string;
    policy: string;
    historyPrefix: string;
    imageQuestion: string;
    german: string;
    offTopic: string;
  };
  productImageFile: StorefrontAssistantAttachmentFile;
  historyNameLength: number;
  defaultVendor: string;
}
