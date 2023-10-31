import { validate, validateEmail, validateMessage, validateName } from './validator';
const thisLargeValidMessage =
  '[U5N70D__b2$]V1zvc5p2ed;Ema9u?AR:Kx3KpM(Y[5pLHX4&(wB9F:(9].,5mQhLER}aiQXp5eCcBCa' +
  'wtg[S(S22xzWr*;qQr$3TmR$0Yqx-pm:r3ZGedf3GALv9k)i:V.4DqDtELw]H?kGbktK_R/bFNCZJw7*' +
  ')WDF=FLhdq#Rd::r4f9*bgK)FS#X+r@f#tz]HPq:MLi2.r{/X{eNw=BT&&-/U+d5TA!TV.=R/Xmr)(GC' +
  '55.t3/B2iva,%uR{*1_*R!tTF@:dP[gNx1u*]dRR,T[uu0M8AX9#B4?4P-UYG1vVbYJ?8U,Wc-v@KNaY' +
  'dY!PyFX@K%3muz1]$2)xF05{@@a}?L3}kVpRpZDN(LByTkV}_Z0*=QDMm77{K?@@D?-,(4(qi?yY{Fgg' +
  'P9!Paw8h+px_P?_S+J%GD{{VXX}@:CD[,uJ+wc@9(nVr;4gEHiv=TbNZzY!%V@!CdARViE@S3e2p=-+8' +
  'yqvu$+ir$ySS00]q)Jhn';

const thisLargeMessageExtra = 'LSL#%+z?1&jHZNTUpC07*}XXcVQY&EBeYeM9#:n[AygkvPMHncZKJ9#}{(#]';

describe('Contact Form Send Email Validation', () => {
  it('should fail on empty email address', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
  });

  it('should fail on bad email address', () => {
    expect(validateEmail('bob')).toBe(false);
    expect(validateEmail('bob@')).toBe(false);
    expect(validateEmail('bob@co')).toBe(false);
    expect(validateEmail('bob@co.u')).toBe(false);
  });
  it('should fail on empty name', () => {
    expect(validateName('')).toBe(false);
    expect(validateName(null)).toBe(false);
  });
  it('should fail on empty message', () => {
    expect(validateMessage('')).toBe(false);
    expect(validateMessage(null)).toBe(false);
  });
  it('should fail on message more than 500 characters', () => {
    expect(validateMessage(thisLargeValidMessage)).toBe(true);
    expect(validateMessage(thisLargeValidMessage + thisLargeMessageExtra)).toBe(false);
  });
});

describe('Contact Form Send Email', () => {
  it('should send email', () => {
    expect(validate('Bob Hope', 'bob@co.uk', 'Hello from Bob')).toBe(true);

    expect(validate('', 'bob@co.uk', 'Hello from Bob')).toBe(false);
    expect(validate('Bob', '', 'Hello from Bob')).toBe(false);
    expect(validate('Bob', 'bob@co.uk', '')).toBe(false);
  });
});
