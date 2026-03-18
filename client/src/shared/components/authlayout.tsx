
import background from '../../assets/background.svg';
import logo from '../../assets/logo.svg';

export const AuthLayout = ({ children, subtitle }: { children: React.ReactNode, subtitle: string }) => (
  <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
    <div className="w-full h-[40vh] lg:h-screen lg:w-1/2 lg:py-6 lg:pl-6 bg-white">
      <div className="relative w-full h-full overflow-hidden lg:rounded-l-3xl shadow-sm">
        <img src={background} className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20 bg-white">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-10">
          <img src={logo} className="h-12 w-auto mb-6" />
          <p className="text-gray-600 font-semibold mt-2 text-center">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  </div>
);