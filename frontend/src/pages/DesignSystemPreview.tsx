import type { ReactNode } from 'react'
import {
  ArrowUpDown,
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleArrowDown,
  CircleArrowUp,
  Dumbbell,
  Eye,
  EyeClosed,
  Gift,
  HeartPulse,
  House,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Mailbox,
  PawPrint,
  PiggyBank,
  Plus,
  ReceiptText,
  Search,
  ShoppingCart,
  SquarePen,
  Tag as TagIcon,
  Ticket,
  Trash,
  UserRound,
  UserRoundPlus,
  Utensils,
  Wallet,
  Wrench,
  X,
} from 'lucide-react'
import {
  Button,
  IconButton,
  Input,
  PaginationButton,
  SelectField,
  Tag,
  TextLink,
  TransactionTypeBadge,
  type TagTone,
} from '../components/ui'
import './design-system-preview.css'

type ColorToken = {
  hex: string
  name: string
}

type ColorSection = {
  title: string
  rows: ColorToken[][]
}

const colorSections: ColorSection[] = [
  {
    title: 'Brand',
    rows: [
      [
        { hex: '#124B2B', name: 'brand-dark' },
        { hex: '#1F6F43', name: 'brand-base' },
      ],
    ],
  },
  {
    title: 'Grayscale',
    rows: [
      [
        { hex: '#111827', name: 'gray-800' },
        { hex: '#374151', name: 'gray-700' },
        { hex: '#4B5563', name: 'gray-600' },
        { hex: '#6B7280', name: 'gray-500' },
        { hex: '#9CA3AF', name: 'gray-400' },
      ],
      [
        { hex: '#D1D5DB', name: 'gray-300' },
        { hex: '#E5E7EB', name: 'gray-200' },
        { hex: '#F8F9FA', name: 'gray-100' },
      ],
    ],
  },
  {
    title: 'Neutral / Feedback',
    rows: [
      [
        { hex: '#000000', name: 'black' },
        { hex: '#FFFFFF', name: 'white' },
        { hex: '#EF4444', name: 'danger' },
        { hex: '#19AD70', name: 'success' },
      ],
    ],
  },
  {
    title: 'Colors',
    rows: [
      [
        { hex: '#1D4ED8', name: 'blue-dark' },
        { hex: '#2563EB', name: 'blue-base' },
        { hex: '#DBEAFE', name: 'blue-light' },
        { hex: '#7E22CE', name: 'purple-dark' },
        { hex: '#9333EA', name: 'purple-base' },
        { hex: '#F3E8FF', name: 'purple-light' },
      ],
      [
        { hex: '#BE185D', name: 'pink-dark' },
        { hex: '#DB2777', name: 'pink-base' },
        { hex: '#FCE7F3', name: 'pink-light' },
        { hex: '#B91C1C', name: 'red-dark' },
        { hex: '#DC2626', name: 'red-base' },
        { hex: '#FEE2E2', name: 'red-light' },
      ],
      [
        { hex: '#C2410C', name: 'orange-dark' },
        { hex: '#EA580C', name: 'orange-base' },
        { hex: '#FFEDD5', name: 'orange-light' },
        { hex: '#A16207', name: 'yellow-dark' },
        { hex: '#CA8A04', name: 'yellow-base' },
        { hex: '#F7F3CA', name: 'yellow-light' },
      ],
      [
        { hex: '#15803D', name: 'green-dark' },
        { hex: '#16A34A', name: 'green-base' },
        { hex: '#E0FAE9', name: 'green-light' },
      ],
    ],
  },
]

const tagTones: TagTone[] = [
  'gray',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
]

const selectOptions = Array.from({ length: 18 }, (_, index) => ({
  label: `Option ${index + 1}`,
  value: `option-${index + 1}`,
}))

const iconList = [
  Mail,
  Lock,
  UserRound,
  UserRoundPlus,
  LogIn,
  LogOut,
  Eye,
  EyeClosed,
  PiggyBank,
  BriefcaseBusiness,
  Utensils,
  ShoppingCart,
  CarFront,
  HeartPulse,
  Ticket,
  Wrench,
  Search,
  SquarePen,
  Trash,
  X,
  Plus,
  Wallet,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CircleArrowDown,
  CircleArrowUp,
  ArrowUpDown,
  TagIcon,
  BookOpen,
  Gift,
  Dumbbell,
  House,
  PawPrint,
  BaggageClaim,
  Mailbox,
  ReceiptText,
  Check,
]

const logoPaths = [
  'M16.7013 10.4383C16.7013 6.97934 13.8972 4.17531 10.4383 4.17531C6.97934 4.17531 4.17531 6.97934 4.17531 10.4383C4.17531 13.8972 6.97934 16.7013 10.4383 16.7013C13.8972 16.7013 16.7013 13.8972 16.7013 10.4383ZM20.8766 10.4383C20.8766 16.2032 16.2032 20.8766 10.4383 20.8766C4.67338 20.8766 0 16.2032 0 10.4383C0 4.67338 4.67338 0 10.4383 0C16.2032 0 20.8766 4.67338 20.8766 10.4383Z',
  'M22.5254 13.0069C22.9284 11.927 24.131 11.3783 25.2111 11.781C26.8553 12.3941 28.3185 13.4116 29.4653 14.7398C30.6121 16.0683 31.4052 17.665 31.7718 19.3813C32.1382 21.0976 32.0665 22.8787 31.5624 24.5597C31.0582 26.2409 30.1383 27.7687 28.8876 29.0001C27.6369 30.2314 26.0953 31.1276 24.4065 31.6056C22.7179 32.0834 20.9358 32.1279 19.2254 31.7347C17.5149 31.3414 15.9311 30.5223 14.6206 29.3548C13.3102 28.1873 12.3157 26.7083 11.7283 25.0544C11.3425 23.968 11.91 22.775 12.9964 22.3891C14.0828 22.0033 15.2758 22.5709 15.6617 23.6572C16.0141 24.6496 16.6111 25.5378 17.3974 26.2383C18.1836 26.9387 19.1343 27.4294 20.1605 27.6654C21.1868 27.9013 22.257 27.8747 23.2703 27.5879C24.2834 27.3011 25.2083 26.7636 25.9587 26.0249C26.709 25.2862 27.2599 24.3695 27.5625 23.3609C27.865 22.3524 27.9087 21.2837 27.6889 20.2539C27.469 19.2242 26.9932 18.2661 26.3052 17.469C25.6171 16.6719 24.7381 16.0605 23.7514 15.6926C22.6715 15.2896 22.1227 14.0871 22.5254 13.0069Z',
  'M9.04652 13.2218V9.04652C8.27786 9.04652 7.65474 8.4234 7.65474 7.65474C7.65474 6.88609 8.27786 6.26297 9.04652 6.26297H10.4383L10.581 6.26977C11.2826 6.34121 11.8301 6.93426 11.8301 7.65474V13.2218C11.8301 13.9905 11.2069 14.6136 10.4383 14.6136C9.66963 14.6136 9.04652 13.9905 9.04652 13.2218Z',
  'M21.5835 17.6311C22.1309 17.0915 23.0119 17.0974 23.5516 17.6447L24.5261 18.6328C25.063 19.1773 25.0599 20.0532 24.5193 20.594L20.5941 24.5193C20.0506 25.0625 19.1695 25.0625 18.626 24.5193C18.0826 23.9758 18.0827 23.0947 18.626 22.5512L21.5727 19.6032L21.57 19.5991C21.0303 19.0518 21.0363 18.1707 21.5835 17.6311Z',
  'M124.839 25.2762C124.607 25.2762 124.491 25.1602 124.491 24.9282V19.5003L120.761 15.7843C120.696 15.7101 120.655 15.6451 120.636 15.5895C120.627 15.5245 120.622 15.4503 120.622 15.3668V7.07182C120.622 6.83986 120.738 6.72388 120.97 6.72388H124.909C125.141 6.72388 125.257 6.83986 125.257 7.07182V15.492H128.374V7.07182C128.374 6.83986 128.49 6.72388 128.722 6.72388H132.661C132.893 6.72388 133.009 6.83986 133.009 7.07182V15.3668C133.009 15.4503 133.004 15.5245 132.995 15.5895C132.986 15.6451 132.944 15.7101 132.87 15.7843L129.154 19.5003V24.9282C129.154 25.1602 129.038 25.2762 128.806 25.2762H124.839Z',
  'M114.697 25.2762C114.483 25.2762 114.298 25.2159 114.14 25.0953L111.871 23.0215L109.575 20.0292C109.473 19.8993 109.408 19.8204 109.38 19.7926C109.352 19.7555 109.338 19.672 109.338 19.5421V12.4441C109.338 12.3142 109.352 12.2307 109.38 12.1935C109.417 12.1564 109.482 12.0776 109.575 11.9569L111.704 9.20123L114.14 6.90481C114.242 6.8213 114.321 6.77027 114.376 6.75171C114.441 6.73316 114.548 6.72388 114.697 6.72388H118.134C118.366 6.72388 118.482 6.83986 118.482 7.07182V9.29866C118.482 9.37288 118.473 9.45175 118.454 9.53526C118.445 9.60948 118.399 9.67443 118.315 9.7301L115.699 11.5255L113.987 13.7245V18.2756L115.726 20.4746L118.315 22.256C118.389 22.3024 118.436 22.3581 118.454 22.4231C118.473 22.488 118.482 22.5576 118.482 22.6318V24.9282C118.482 25.1602 118.366 25.2762 118.134 25.2762H114.697Z',
  'M94.6155 25.2762C94.3835 25.2762 94.2675 25.1602 94.2675 24.9282V7.07182C94.2675 6.83986 94.3835 6.72388 94.6155 6.72388H102.521C102.743 6.72388 102.929 6.79811 103.077 6.94656L105.861 9.7301C106.019 9.88784 106.098 10.0734 106.098 10.2868V24.9282C106.098 25.1602 105.982 25.2762 105.75 25.2762H101.811C101.579 25.2762 101.463 25.1602 101.463 24.9282V10.426H98.9021V24.9282C98.9021 25.1602 98.7861 25.2762 98.5542 25.2762H94.6155Z',
  'M78.9693 25.2762C78.7374 25.2762 78.6214 25.1602 78.6214 24.9282V12.0265C78.6214 11.9059 78.6678 11.7667 78.7606 11.609L82.0591 6.93264C82.1611 6.79347 82.3096 6.72388 82.5044 6.72388H87.1112C87.3153 6.72388 87.4638 6.79347 87.5566 6.93264L90.869 11.609C90.9618 11.7389 91.0082 11.8781 91.0082 12.0265V24.9282C91.0082 25.1602 90.8922 25.2762 90.6602 25.2762H86.7215C86.4895 25.2762 86.3736 25.1602 86.3736 24.9282V19.0132H83.2699V24.9282C83.2699 25.1602 83.1539 25.2762 82.922 25.2762H78.9693ZM84.8148 16.0209C85.6684 16.0209 86.2437 15.8353 86.5406 15.4642C86.8468 15.0838 86.9999 14.3647 86.9999 13.307C86.9999 12.2492 86.8468 11.5348 86.5406 11.1636C86.2437 10.7832 85.6684 10.593 84.8148 10.593C83.9704 10.593 83.3952 10.7832 83.089 11.1636C82.7921 11.5348 82.6436 12.2492 82.6436 13.307C82.6436 14.3647 82.7921 15.0838 83.089 15.4642C83.3952 15.8353 83.9704 16.0209 84.8148 16.0209Z',
  'M63.8986 25.2762C63.6667 25.2762 63.5507 25.1602 63.5507 24.9282V7.07182C63.5507 6.83986 63.6667 6.72388 63.8986 6.72388H71.8039C72.0266 6.72388 72.2122 6.79811 72.3606 6.94656L75.1442 9.7301C75.3019 9.88784 75.3807 10.0734 75.3807 10.2868V24.9282C75.3807 25.1602 75.2648 25.2762 75.0328 25.2762H71.0941C70.8621 25.2762 70.7462 25.1602 70.7462 24.9282V10.426H68.1853V24.9282C68.1853 25.1602 68.0693 25.2762 67.8374 25.2762H63.8986Z',
  'M55.934 25.2762C55.702 25.2762 55.5861 25.1602 55.5861 24.9282V7.07182C55.5861 6.83986 55.702 6.72388 55.934 6.72388H59.8727C60.1047 6.72388 60.2207 6.83986 60.2207 7.07182V24.9282C60.2207 25.1602 60.1047 25.2762 59.8727 25.2762H55.934Z',
  'M43.4842 25.2762C43.2522 25.2762 43.1362 25.1602 43.1362 24.9282V7.07182C43.1362 6.83986 43.2522 6.72388 43.4842 6.72388H53.0178C53.2498 6.72388 53.3658 6.83986 53.3658 7.07182V10.078C53.3658 10.31 53.2498 10.426 53.0178 10.426H47.7708V15.0745H52.3219C52.5539 15.0745 52.6699 15.1905 52.6699 15.4225V18.4287C52.6699 18.6606 52.5539 18.7766 52.3219 18.7766H47.7708V24.9282C47.7708 25.1602 47.6548 25.2762 47.4229 25.2762H43.4842Z',
]

const logoIconPaths = [
  'M20.8752 13.0479C20.8752 8.72418 17.3704 5.21914 13.047 5.21914C8.72362 5.21914 5.21881 8.72418 5.21881 13.0479C5.21881 17.3715 8.72362 20.8766 13.047 20.8766C17.3704 20.8766 20.8752 17.3715 20.8752 13.0479ZM26.094 13.0479C26.094 20.254 20.2527 26.0957 13.047 26.0957C5.84135 26.0957 0 20.254 0 13.0479C0 5.84173 5.84135 0 13.047 0C20.2527 0 26.094 5.84173 26.094 13.0479Z',
  'M28.155 16.2587C28.6587 14.9087 30.1618 14.2228 31.5119 14.7262C33.567 15.4926 35.3959 16.7645 36.8292 18.4248C38.2627 20.0854 39.254 22.0813 39.7121 24.2267C40.1702 26.372 40.0806 28.5984 39.4505 30.6996C38.8202 32.8011 37.6705 34.7109 36.1072 36.2501C34.5439 37.7892 32.617 38.9095 30.5062 39.5069C28.3955 40.1043 26.168 40.1598 24.0302 39.6683C21.8922 39.1768 19.9126 38.1529 18.2746 36.6935C16.6367 35.2341 15.3936 33.3854 14.6595 31.3181C14.1772 29.96 14.8865 28.4688 16.2445 27.9864C17.6024 27.5041 19.0935 28.2136 19.5759 29.5715C20.0164 30.812 20.7625 31.9222 21.7453 32.7978C22.728 33.6734 23.9163 34.2868 25.199 34.5817C26.4818 34.8767 27.8194 34.8434 29.0859 34.4849C30.3523 34.1264 31.5084 33.4545 32.4462 32.5311C33.3841 31.6077 34.0727 30.4618 34.4509 29.2012C34.829 27.9405 34.8836 26.6046 34.6088 25.3174C34.334 24.0303 33.7394 22.8326 32.8794 21.8363C32.0193 20.8398 30.9207 20.0756 29.6873 19.6158C28.3375 19.112 27.6517 17.6088 28.155 16.2587Z',
  'M11.3074 16.5273V11.3081C10.3467 11.3081 9.56781 10.5292 9.56781 9.56843C9.56781 8.60761 10.3467 7.82872 11.3074 7.82872H13.047L13.2254 7.83721C14.1024 7.92651 14.7866 8.66782 14.7866 9.56843V16.5273C14.7866 17.4881 14.0078 18.267 13.047 18.267C12.0863 18.267 11.3074 17.4881 11.3074 16.5273Z',
  'M26.9777 22.0389C27.6618 21.3643 28.7631 21.3718 29.4376 22.0558L30.6557 23.291C31.3267 23.9716 31.3228 25.0665 30.6472 25.7425L25.7409 30.6491C25.0617 31.3282 23.9603 31.3282 23.281 30.6491C22.6018 29.9698 22.6019 28.8684 23.281 28.189L26.9641 24.504L26.9607 24.4989C26.2862 23.8148 26.2937 22.7134 26.9777 22.0389Z',
]

function ColorCard({ hex, name }: ColorToken) {
  return (
    <article className="ds-color-card">
      <span
        aria-label={`${name} ${hex}`}
        className="ds-color-card__swatch"
        style={{ backgroundColor: hex }}
      />
      <strong>{hex}</strong>
      <span>{name}</span>
    </article>
  )
}

function DesignPanel({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <section className="ds-panel" aria-labelledby={`ds-${title}`}>
      <h1 id={`ds-${title}`}>{title}</h1>
      {children}
    </section>
  )
}

function ComponentSpec({
  children,
  labels,
}: {
  children: ReactNode
  labels?: string[]
}) {
  return (
    <div className="ds-component-spec">
      <div className="ds-component-spec__canvas">{children}</div>
      {labels ? (
        <div className="ds-component-spec__labels" aria-hidden="true">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function FinancyLogo() {
  return (
    <svg
      aria-label="Financy"
      className="ds-logo"
      fill="none"
      height="32"
      viewBox="0 0 134 32"
      width="134"
      xmlns="http://www.w3.org/2000/svg"
    >
      {logoPaths.map((path) => (
        <path d={path} fill="#1F6F43" key={path} />
      ))}
    </svg>
  )
}

function FinancyLogoIcon() {
  return (
    <svg
      aria-hidden="true"
      className="ds-logo-icon"
      fill="none"
      height="40"
      viewBox="0 0 40 40"
      width="40"
      xmlns="http://www.w3.org/2000/svg"
    >
      {logoIconPaths.map((path) => (
        <path d={path} fill="#1F6F43" key={path} />
      ))}
    </svg>
  )
}

export function DesignSystemPreview() {
  return (
    <main className="ds-preview">
      <DesignPanel title="Cores">
        <div className="ds-color-sections">
          {colorSections.map((section) => (
            <section className="ds-color-section" key={section.title}>
              <h2>{section.title}</h2>
              <div className="ds-color-section__rows">
                {section.rows.map((row) => (
                  <div className="ds-color-row" key={row.map((color) => color.name).join('-')}>
                    {row.map((color) => (
                      <ColorCard key={color.name} {...color} />
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </DesignPanel>

      <DesignPanel title="Tipografia">
        <div className="ds-font-row">
          <div>
            <p>Font Family</p>
            <strong>Inter</strong>
          </div>
          <div className="ds-note">
            Esta fonte pode ser acessada em <strong>Google Fonts</strong>
          </div>
        </div>
      </DesignPanel>

      <DesignPanel title="Ícones">
        <div className="ds-icon-grid" aria-label="Lucide Icons">
          {iconList.map((Icon, index) => (
            <Icon aria-hidden="true" key={index} size={24} strokeWidth={1.8} />
          ))}
        </div>
        <div className="ds-note">Os icones podem ser acessados em <strong>Lucide Icons</strong></div>
      </DesignPanel>

      <DesignPanel title="Vetores">
        <div className="ds-vector-row">
          <FinancyLogo />
          <FinancyLogoIcon />
        </div>
      </DesignPanel>

      <DesignPanel title="Componentes">
        <div className="ds-component-group">
          <h2>Input</h2>
          <ComponentSpec labels={['Empty', 'Active', 'Filled', 'Error', 'Disabled', 'Select']}>
            <Input
              label="Label"
              leftIcon={<Mail aria-hidden="true" />}
              placeholder="Placebolder"
            />
            <Input
              className="is-preview-active"
              label="Label"
              leftIcon={<Mail aria-hidden="true" />}
              readOnly
              value="Text"
            />
            <Input
              helperText="Helper"
              label="Label"
              leftIcon={<Mail aria-hidden="true" />}
              readOnly
              value="Text"
            />
            <Input
              error="Helper"
              label="Label"
              leftIcon={<Mail aria-hidden="true" />}
              readOnly
              value="Text"
            />
            <Input
              disabled
              label="Label"
              leftIcon={<Mail aria-hidden="true" />}
              value="Text"
            />
            <SelectField
              defaultValue="option-1"
              label="Label"
              leftIcon={<Mail aria-hidden="true" />}
              options={selectOptions}
            />
          </ComponentSpec>
        </div>

        <div className="ds-component-group">
          <h2>Label Button</h2>
          <ComponentSpec
            labels={[
              'Md / Default',
              'Md / Hover',
              'Md / Disabled',
              'Sm / Default',
              'Sm / Hover',
              'Sm / Disabled',
            ]}
          >
            <div className="ds-button-pair">
              <Button icon={<UserRoundPlus aria-hidden="true" />}>Label</Button>
              <Button icon={<UserRoundPlus aria-hidden="true" />} variant="outline">
                Label
              </Button>
            </div>
            <div className="ds-button-pair">
              <Button className="is-preview-hover" icon={<UserRoundPlus aria-hidden="true" />}>
                Label
              </Button>
              <Button
                className="is-preview-hover"
                icon={<UserRoundPlus aria-hidden="true" />}
                variant="outline"
              >
                Label
              </Button>
            </div>
            <div className="ds-button-pair">
              <Button disabled icon={<UserRoundPlus aria-hidden="true" />}>
                Label
              </Button>
              <Button disabled icon={<UserRoundPlus aria-hidden="true" />} variant="outline">
                Label
              </Button>
            </div>
            <div className="ds-button-pair">
              <Button icon={<UserRoundPlus aria-hidden="true" />} size="sm">
                Label
              </Button>
              <Button icon={<UserRoundPlus aria-hidden="true" />} size="sm" variant="outline">
                Label
              </Button>
            </div>
            <div className="ds-button-pair">
              <Button
                className="is-preview-hover"
                icon={<UserRoundPlus aria-hidden="true" />}
                size="sm"
              >
                Label
              </Button>
              <Button
                className="is-preview-hover"
                icon={<UserRoundPlus aria-hidden="true" />}
                size="sm"
                variant="outline"
              >
                Label
              </Button>
            </div>
            <div className="ds-button-pair">
              <Button disabled icon={<UserRoundPlus aria-hidden="true" />} size="sm">
                Label
              </Button>
              <Button disabled icon={<UserRoundPlus aria-hidden="true" />} size="sm" variant="outline">
                Label
              </Button>
            </div>
          </ComponentSpec>
        </div>

        <div className="ds-component-group">
          <h2>Icon Button</h2>
          <ComponentSpec labels={['Default', 'Hover', 'Disabled']}>
            <div className="ds-icon-button-pair">
              <IconButton label="Adicionar">
                <UserRoundPlus aria-hidden="true" />
              </IconButton>
              <IconButton label="Excluir" variant="danger">
                <Trash aria-hidden="true" />
              </IconButton>
            </div>
            <div className="ds-icon-button-pair">
              <IconButton className="is-preview-hover" label="Adicionar">
                <UserRoundPlus aria-hidden="true" />
              </IconButton>
              <IconButton className="is-preview-hover" label="Excluir" variant="danger">
                <Trash aria-hidden="true" />
              </IconButton>
            </div>
            <div className="ds-icon-button-pair">
              <IconButton disabled label="Adicionar">
                <UserRoundPlus aria-hidden="true" />
              </IconButton>
              <IconButton disabled label="Excluir" variant="danger">
                <Trash aria-hidden="true" />
              </IconButton>
            </div>
          </ComponentSpec>
        </div>

        <div className="ds-component-group">
          <h2>Link</h2>
          <ComponentSpec labels={['Default', 'Hover']}>
            <TextLink>Label</TextLink>
            <TextLink className="is-preview-hover">Label</TextLink>
          </ComponentSpec>
        </div>

        <div className="ds-component-group">
          <h2>Pagination Button</h2>
          <ComponentSpec labels={['Default', 'Hover', 'Active', 'Disabled']}>
            <PaginationButton>1</PaginationButton>
            <PaginationButton className="is-preview-hover">1</PaginationButton>
            <PaginationButton active>1</PaginationButton>
            <PaginationButton disabled>1</PaginationButton>
          </ComponentSpec>
        </div>

        <div className="ds-component-group">
          <h2>Tag</h2>
          <ComponentSpec>
            <div className="ds-tag-grid">
              {tagTones.map((tone) => (
                <Tag key={tone} tone={tone}>
                  Label
                </Tag>
              ))}
            </div>
          </ComponentSpec>
        </div>

        <div className="ds-component-group">
          <h2>Type</h2>
          <ComponentSpec>
            <div className="ds-type-stack">
              <TransactionTypeBadge type="INCOME" />
              <TransactionTypeBadge type="EXPENSE" />
            </div>
          </ComponentSpec>
        </div>
      </DesignPanel>
    </main>
  )
}
