import React from 'react';
import type { BrandBible, ColorInfo, FontPair } from '../types';
import { Card, CardContent } from './ui/card';

interface BrandBibleDisplayProps {
    brandBible: BrandBible;
}

const ColorSwatch: React.FC<{ color: ColorInfo }> = ({ color }) => (
    <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full shadow-md border-4 border-background" style={{ backgroundColor: color.hex }}></div>
        <h4 className="font-semibold mt-3">{color.name}</h4>
        <p className="text-sm text-muted-foreground">{color.hex}</p>
        <p className="text-xs text-muted-foreground mt-1">{color.usage}</p>
    </div>
);

const FontDisplay: React.FC<{ fonts: FontPair }> = ({ fonts }) => (
    <div>
        <link href={`https://fonts.googleapis.com/css2?family=${fonts.header.replace(/ /g, '+')}:wght@700&family=${fonts.body.replace(/ /g, '+')}:wght@400&display=swap`} rel="stylesheet" />
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: `'${fonts.header}', sans-serif` }}>Header Font: {fonts.header}</h3>
            <p className="text-4xl" style={{ fontFamily: `'${fonts.header}', sans-serif` }}>The quick brown fox jumps over the lazy dog.</p>
        </div>
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: `'${fonts.body}', sans-serif` }}>Body Font: {fonts.body}</h3>
            <p style={{ fontFamily: `'${fonts.body}', sans-serif` }}>The quick brown fox jumps over the lazy dog. This is some body text to demonstrate the font pairing. It should be legible and complement the header font.</p>
        </div>
         <p className="text-sm text-muted-foreground italic">&ldquo;{fonts.notes}&rdquo;</p>
    </div>
);


export const BrandBibleDisplay: React.FC<BrandBibleDisplayProps> = ({ brandBible }) => {
    return (
        <div className="space-y-12">
            <header className="text-center py-12 bg-muted/40 rounded-lg">
                <h1 className="text-5xl font-bold tracking-tight">{brandBible.companyName}</h1>
                <p className="text-xl text-muted-foreground mt-4">&ldquo;{brandBible.slogan}&rdquo;</p>
            </header>

            <section>
                <h2 className="text-3xl font-bold text-center mb-8">Primary Logo</h2>
                <div className="flex justify-center">
                    <img src={brandBible.primaryLogoUrl} alt={`${brandBible.companyName} Primary Logo`} className="max-w-xs w-full h-auto rounded-lg shadow-lg bg-white p-4" />
                </div>
            </section>
            
            {brandBible.secondaryMarkUrls.length > 0 && (
                 <section>
                    <h2 className="text-3xl font-bold text-center mb-8">Secondary Marks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {brandBible.secondaryMarkUrls.map((url, index) => (
                             <div key={index} className="flex justify-center">
                                <img src={url} alt={`Secondary Mark ${index + 1}`} className="max-w-[150px] w-full h-auto rounded-lg shadow-lg bg-white p-2" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h2 className="text-3xl font-bold text-center mb-8">Color Palette</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
                    {brandBible.colorPalette.map(color => <ColorSwatch key={color.hex} color={color} />)}
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-bold text-center mb-8">Typography</h2>
                 <Card>
                    <CardContent className="p-8">
                        <FontDisplay fonts={brandBible.fontPairings} />
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};
