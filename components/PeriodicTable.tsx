import React, { useState } from 'react';

const elementData = [
	{"name":"Hydrogen","atomic_number":1,"symbol":"H","atomic_mass":1.008,"category":"diatomic nonmetal","x":1,"y":1,"electron_configuration":"1s1"},
	{"name":"Helium","atomic_number":2,"symbol":"He","atomic_mass":4.0026022,"category":"noble gas","x":18,"y":1,"electron_configuration":"1s2"},
	{"name":"Lithium","atomic_number":3,"symbol":"Li","atomic_mass":6.94,"category":"alkali metal","x":1,"y":2,"electron_configuration":"[He] 2s1"},
	{"name":"Beryllium","atomic_number":4,"symbol":"Be","atomic_mass":9.01218315,"category":"alkaline earth metal","x":2,"y":2,"electron_configuration":"[He] 2s2"},
	{"name":"Boron","atomic_number":5,"symbol":"B","atomic_mass":10.81,"category":"metalloid","x":13,"y":2,"electron_configuration":"[He] 2s2 2p1"},
	{"name":"Carbon","atomic_number":6,"symbol":"C","atomic_mass":12.011,"category":"polyatomic nonmetal","x":14,"y":2,"electron_configuration":"[He] 2s2 2p2"},
	{"name":"Nitrogen","atomic_number":7,"symbol":"N","atomic_mass":14.007,"category":"diatomic nonmetal","x":15,"y":2,"electron_configuration":"[He] 2s2 2p3"},
	{"name":"Oxygen","atomic_number":8,"symbol":"O","atomic_mass":15.999,"category":"diatomic nonmetal","x":16,"y":2,"electron_configuration":"[He] 2s2 2p4"},
	{"name":"Fluorine","atomic_number":9,"symbol":"F","atomic_mass":18.9984031636,"category":"diatomic nonmetal","x":17,"y":2,"electron_configuration":"[He] 2s2 2p5"},
	{"name":"Neon","atomic_number":10,"symbol":"Ne","atomic_mass":20.17976,"category":"noble gas","x":18,"y":2,"electron_configuration":"[He] 2s2 2p6"},
	{"name":"Sodium","atomic_number":11,"symbol":"Na","atomic_mass":22.989769282,"category":"alkali metal","x":1,"y":3,"electron_configuration":"[Ne] 3s1"},
	{"name":"Magnesium","atomic_number":12,"symbol":"Mg","atomic_mass":24.305,"category":"alkaline earth metal","x":2,"y":3,"electron_configuration":"[Ne] 3s2"},
	{"name":"Aluminium","atomic_number":13,"symbol":"Al","atomic_mass":26.98153857,"category":"post-transition metal","x":13,"y":3,"electron_configuration":"[Ne] 3s2 3p1"},
	{"name":"Silicon","atomic_number":14,"symbol":"Si","atomic_mass":28.085,"category":"metalloid","x":14,"y":3,"electron_configuration":"[Ne] 3s2 3p2"},
	{"name":"Phosphorus","atomic_number":15,"symbol":"P","atomic_mass":30.9737619985,"category":"polyatomic nonmetal","x":15,"y":3,"electron_configuration":"[Ne] 3s2 3p3"},
	{"name":"Sulfur","atomic_number":16,"symbol":"S","atomic_mass":32.06,"category":"polyatomic nonmetal","x":16,"y":3,"electron_configuration":"[Ne] 3s2 3p4"},
	{"name":"Chlorine","atomic_number":17,"symbol":"Cl","atomic_mass":35.45,"category":"diatomic nonmetal","x":17,"y":3,"electron_configuration":"[Ne] 3s2 3p5"},
	{"name":"Argon","atomic_number":18,"symbol":"Ar","atomic_mass":39.9481,"category":"noble gas","x":18,"y":3,"electron_configuration":"[Ne] 3s2 3p6"},
	{"name":"Potassium","atomic_number":19,"symbol":"K","atomic_mass":39.09831,"category":"alkali metal","x":1,"y":4,"electron_configuration":"[Ar] 4s1"},
	{"name":"Calcium","atomic_number":20,"symbol":"Ca","atomic_mass":40.0784,"category":"alkaline earth metal","x":2,"y":4,"electron_configuration":"[Ar] 4s2"},
	{"name":"Scandium","atomic_number":21,"symbol":"Sc","atomic_mass":44.9559085,"category":"transition metal","x":3,"y":4,"electron_configuration":"[Ar] 3d1 4s2"},
	{"name":"Titanium","atomic_number":22,"symbol":"Ti","atomic_mass":47.8671,"category":"transition metal","x":4,"y":4,"electron_configuration":"[Ar] 3d2 4s2"},
	{"name":"Vanadium","atomic_number":23,"symbol":"V","atomic_mass":50.94151,"category":"transition metal","x":5,"y":4,"electron_configuration":"[Ar] 3d3 4s2"},
	{"name":"Chromium","atomic_number":24,"symbol":"Cr","atomic_mass":51.99616,"category":"transition metal","x":6,"y":4,"electron_configuration":"[Ar] 3d5 4s1"},
	{"name":"Manganese","atomic_number":25,"symbol":"Mn","atomic_mass":54.9380443,"category":"transition metal","x":7,"y":4,"electron_configuration":"[Ar] 3d5 4s2"},
	{"name":"Iron","atomic_number":26,"symbol":"Fe","atomic_mass":55.8452,"category":"transition metal","x":8,"y":4,"electron_configuration":"[Ar] 3d6 4s2"},
	{"name":"Cobalt","atomic_number":27,"symbol":"Co","atomic_mass":58.9331944,"category":"transition metal","x":9,"y":4,"electron_configuration":"[Ar] 3d7 4s2"},
	{"name":"Nickel","atomic_number":28,"symbol":"Ni","atomic_mass":58.69344,"category":"transition metal","x":10,"y":4,"electron_configuration":"[Ar] 3d8 4s2"},
	{"name":"Copper","atomic_number":29,"symbol":"Cu","atomic_mass":63.5463,"category":"transition metal","x":11,"y":4,"electron_configuration":"[Ar] 3d10 4s1"},
	{"name":"Zinc","atomic_number":30,"symbol":"Zn","atomic_mass":65.382,"category":"post-transition metal","x":12,"y":4,"electron_configuration":"[Ar] 3d10 4s2"},
	{"name":"Gallium","atomic_number":31,"symbol":"Ga","atomic_mass":69.7231,"category":"post-transition metal","x":13,"y":4,"electron_configuration":"[Ar] 3d10 4s2 4p1"},
	{"name":"Germanium","atomic_number":32,"symbol":"Ge","atomic_mass":72.6308,"category":"metalloid","x":14,"y":4,"electron_configuration":"[Ar] 3d10 4s2 4p2"},
	{"name":"Arsenic","atomic_number":33,"symbol":"As","atomic_mass":74.9215956,"category":"metalloid","x":15,"y":4,"electron_configuration":"[Ar] 3d10 4s2 4p3"},
	{"name":"Selenium","atomic_number":34,"symbol":"Se","atomic_mass":78.9718,"category":"polyatomic nonmetal","x":16,"y":4,"electron_configuration":"[Ar] 3d10 4s2 4p4"},
	{"name":"Bromine","atomic_number":35,"symbol":"Br","atomic_mass":79.904,"category":"diatomic nonmetal","x":17,"y":4,"electron_configuration":"[Ar] 3d10 4s2 4p5"},
	{"name":"Krypton","atomic_number":36,"symbol":"Kr","atomic_mass":83.7982,"category":"noble gas","x":18,"y":4,"electron_configuration":"[Ar] 3d10 4s2 4p6"},
	{"name":"Rubidium","atomic_number":37,"symbol":"Rb","atomic_mass":85.46783,"category":"alkali metal","x":1,"y":5,"electron_configuration":"[Kr] 5s1"},
	{"name":"Strontium","atomic_number":38,"symbol":"Sr","atomic_mass":87.621,"category":"alkaline earth metal","x":2,"y":5,"electron_configuration":"[Kr] 5s2"},
	{"name":"Yttrium","atomic_number":39,"symbol":"Y","atomic_mass":88.905842,"category":"transition metal","x":3,"y":5,"electron_configuration":"[Kr] 4d1 5s2"},
	{"name":"Zirconium","atomic_number":40,"symbol":"Zr","atomic_mass":91.2242,"category":"transition metal","x":4,"y":5,"electron_configuration":"[Kr] 4d2 5s2"},
	{"name":"Niobium","atomic_number":41,"symbol":"Nb","atomic_mass":92.906372,"category":"transition metal","x":5,"y":5,"electron_configuration":"[Kr] 4d4 5s1"},
	{"name":"Molybdenum","atomic_number":42,"symbol":"Mo","atomic_mass":95.951,"category":"transition metal","x":6,"y":5,"electron_configuration":"[Kr] 4d5 5s1"},
	{"name":"Technetium","atomic_number":43,"symbol":"Tc","atomic_mass":98,"category":"transition metal","x":7,"y":5,"electron_configuration":"[Kr] 4d5 5s2"},
	{"name":"Ruthenium","atomic_number":44,"symbol":"Ru","atomic_mass":101.072,"category":"transition metal","x":8,"y":5,"electron_configuration":"[Kr] 4d7 5s1"},
	{"name":"Rhodium","atomic_number":45,"symbol":"Rh","atomic_mass":102.905502,"category":"transition metal","x":9,"y":5,"electron_configuration":"[Kr] 4d8 5s1"},
	{"name":"Palladium","atomic_number":46,"symbol":"Pd","atomic_mass":106.421,"category":"transition metal","x":10,"y":5,"electron_configuration":"[Kr] 4d10"},
	{"name":"Silver","atomic_number":47,"symbol":"Ag","atomic_mass":107.86822,"category":"transition metal","x":11,"y":5,"electron_configuration":"[Kr] 4d10 5s1"},
	{"name":"Cadmium","atomic_number":48,"symbol":"Cd","atomic_mass":112.4144,"category":"post-transition metal","x":12,"y":5,"electron_configuration":"[Kr] 4d10 5s2"},
	{"name":"Indium","atomic_number":49,"symbol":"In","atomic_mass":114.8181,"category":"post-transition metal","x":13,"y":5,"electron_configuration":"[Kr] 4d10 5s2 5p1"},
	{"name":"Tin","atomic_number":50,"symbol":"Sn","atomic_mass":118.7107,"category":"post-transition metal","x":14,"y":5,"electron_configuration":"[Kr] 4d10 5s2 5p2"},
	{"name":"Antimony","atomic_number":51,"symbol":"Sb","atomic_mass":121.7601,"category":"metalloid","x":15,"y":5,"electron_configuration":"[Kr] 4d10 5s2 5p3"},
	{"name":"Tellurium","atomic_number":52,"symbol":"Te","atomic_mass":127.603,"category":"metalloid","x":16,"y":5,"electron_configuration":"[Kr] 4d10 5s2 5p4"},
	{"name":"Iodine","atomic_number":53,"symbol":"I","atomic_mass":126.904473,"category":"diatomic nonmetal","x":17,"y":5,"electron_configuration":"[Kr] 4d10 5s2 5p5"},
	{"name":"Xenon","atomic_number":54,"symbol":"Xe","atomic_mass":131.2936,"category":"noble gas","x":18,"y":5,"electron_configuration":"[Kr] 4d10 5s2 5p6"},
	{"name":"Caesium","atomic_number":55,"symbol":"Cs","atomic_mass":132.905451966,"category":"alkali metal","x":1,"y":6,"electron_configuration":"[Xe] 6s1"},
	{"name":"Barium","atomic_number":56,"symbol":"Ba","atomic_mass":137.3277,"category":"alkaline earth metal","x":2,"y":6,"electron_configuration":"[Xe] 6s2"},
	{"name":"Lanthanum","atomic_number":57,"symbol":"La","atomic_mass":138.905477,"category":"lanthanide","x":3,"y":9,"electron_configuration":"[Xe] 5d1 6s2"},
	{"name":"Cerium","atomic_number":58,"symbol":"Ce","atomic_mass":140.1161,"category":"lanthanide","x":4,"y":9,"electron_configuration":"[Xe] 4f1 5d1 6s2"},
	{"name":"Praseodymium","atomic_number":59,"symbol":"Pr","atomic_mass":140.907662,"category":"lanthanide","x":5,"y":9,"electron_configuration":"[Xe] 4f3 6s2"},
	{"name":"Neodymium","atomic_number":60,"symbol":"Nd","atomic_mass":144.2423,"category":"lanthanide","x":6,"y":9,"electron_configuration":"[Xe] 4f4 6s2"},
	{"name":"Promethium","atomic_number":61,"symbol":"Pm","atomic_mass":145,"category":"lanthanide","x":7,"y":9,"electron_configuration":"[Xe] 4f5 6s2"},
	{"name":"Samarium","atomic_number":62,"symbol":"Sm","atomic_mass":150.362,"category":"lanthanide","x":8,"y":9,"electron_configuration":"[Xe] 4f6 6s2"},
	{"name":"Europium","atomic_number":63,"symbol":"Eu","atomic_mass":151.9641,"category":"lanthanide","x":9,"y":9,"electron_configuration":"[Xe] 4f7 6s2"},
	{"name":"Gadolinium","atomic_number":64,"symbol":"Gd","atomic_mass":157.253,"category":"lanthanide","x":10,"y":9,"electron_configuration":"[Xe] 4f7 5d1 6s2"},
	{"name":"Terbium","atomic_number":65,"symbol":"Tb","atomic_mass":158.925352,"category":"lanthanide","x":11,"y":9,"electron_configuration":"[Xe] 4f9 6s2"},
	{"name":"Dysprosium","atomic_number":66,"symbol":"Dy","atomic_mass":162.5001,"category":"lanthanide","x":12,"y":9,"electron_configuration":"[Xe] 4f10 6s2"},
	{"name":"Holmium","atomic_number":67,"symbol":"Ho","atomic_mass":164.930332,"category":"lanthanide","x":13,"y":9,"electron_configuration":"[Xe] 4f11 6s2"},
	{"name":"Erbium","atomic_number":68,"symbol":"Er","atomic_mass":167.2593,"category":"lanthanide","x":14,"y":9,"electron_configuration":"[Xe] 4f12 6s2"},
	{"name":"Thulium","atomic_number":69,"symbol":"Tm","atomic_mass":168.934222,"category":"lanthanide","x":15,"y":9,"electron_configuration":"[Xe] 4f13 6s2"},
	{"name":"Ytterbium","atomic_number":70,"symbol":"Yb","atomic_mass":173.0451,"category":"lanthanide","x":16,"y":9,"electron_configuration":"[Xe] 4f14 6s2"},
	{"name":"Lutetium","atomic_number":71,"symbol":"Lu","atomic_mass":174.96681,"category":"lanthanide","x":17,"y":9,"electron_configuration":"[Xe] 4f14 5d1 6s2"},
	{"name":"Hafnium","atomic_number":72,"symbol":"Hf","atomic_mass":178.492,"category":"transition metal","x":4,"y":6,"electron_configuration":"[Xe] 4f14 5d2 6s2"},
	{"name":"Tantalum","atomic_number":73,"symbol":"Ta","atomic_mass":180.947882,"category":"transition metal","x":5,"y":6,"electron_configuration":"[Xe] 4f14 5d3 6s2"},
	{"name":"Tungsten","atomic_number":74,"symbol":"W","atomic_mass":183.841,"category":"transition metal","x":6,"y":6,"electron_configuration":"[Xe] 4f14 5d4 6s2"},
	{"name":"Rhenium","atomic_number":75,"symbol":"Re","atomic_mass":186.2071,"category":"transition metal","x":7,"y":6,"electron_configuration":"[Xe] 4f14 5d5 6s2"},
	{"name":"Osmium","atomic_number":76,"symbol":"Os","atomic_mass":190.233,"category":"transition metal","x":8,"y":6,"electron_configuration":"[Xe] 4f14 5d6 6s2"},
	{"name":"Iridium","atomic_number":77,"symbol":"Ir","atomic_mass":192.2173,"category":"transition metal","x":9,"y":6,"electron_configuration":"[Xe] 4f14 5d7 6s2"},
	{"name":"Platinum","atomic_number":78,"symbol":"Pt","atomic_mass":195.0849,"category":"transition metal","x":10,"y":6,"electron_configuration":"[Xe] 4f14 5d9 6s1"},
	{"name":"Gold","atomic_number":79,"symbol":"Au","atomic_mass":196.9665695,"category":"transition metal","x":11,"y":6,"electron_configuration":"[Xe] 4f14 5d10 6s1"},
	{"name":"Mercury","atomic_number":80,"symbol":"Hg","atomic_mass":200.5923,"category":"post-transition metal","x":12,"y":6,"electron_configuration":"[Xe] 4f14 5d10 6s2"},
	{"name":"Thallium","atomic_number":81,"symbol":"Tl","atomic_mass":204.38,"category":"post-transition metal","x":13,"y":6,"electron_configuration":"[Xe] 4f14 5d10 6s2 6p1"},
	{"name":"Lead","atomic_number":82,"symbol":"Pb","atomic_mass":207.21,"category":"post-transition metal","x":14,"y":6,"electron_configuration":"[Xe] 4f14 5d10 6s2 6p2"},
	{"name":"Bismuth","atomic_number":83,"symbol":"Bi","atomic_mass":208.980401,"category":"post-transition metal","x":15,"y":6,"electron_configuration":"[Xe] 4f14 5d10 6s2 6p3"},
	{"name":"Polonium","atomic_number":84,"symbol":"Po","atomic_mass":209,"category":"post-transition metal","x":16,"y":6,"electron_configuration":"[Xe] 4f14 5d10 6s2 6p4"},
	{"name":"Astatine","atomic_number":85,"symbol":"At","atomic_mass":210,"category":"metalloid","x":17,"y":6,"electron_configuration":"[Xe] 4f14 5d10 6s2 6p5"},
	{"name":"Radon","atomic_number":86,"symbol":"Rn","atomic_mass":222,"category":"noble gas","x":18,"y":6,"electron_configuration":"[Xe] 4f14 5d10 6s2 6p6"},
	{"name":"Francium","atomic_number":87,"symbol":"Fr","atomic_mass":223,"category":"alkali metal","x":1,"y":7,"electron_configuration":"[Rn] 7s1"},
	{"name":"Radium","atomic_number":88,"symbol":"Ra","atomic_mass":226,"category":"alkaline earth metal","x":2,"y":7,"electron_configuration":"[Rn] 7s2"},
	{"name":"Actinium","atomic_number":89,"symbol":"Ac","atomic_mass":227,"category":"actinide","x":3,"y":10,"electron_configuration":"[Rn] 6d1 7s2"},
	{"name":"Thorium","atomic_number":90,"symbol":"Th","atomic_mass":232.03774,"category":"actinide","x":4,"y":10,"electron_configuration":"[Rn] 6d2 7s2"},
	{"name":"Protactinium","atomic_number":91,"symbol":"Pa","atomic_mass":231.035882,"category":"actinide","x":5,"y":10,"electron_configuration":"[Rn] 5f2 6d1 7s2"},
	{"name":"Uranium","atomic_number":92,"symbol":"U","atomic_mass":238.028913,"category":"actinide","x":6,"y":10,"electron_configuration":"[Rn] 5f3 6d1 7s2"},
	{"name":"Neptunium","atomic_number":93,"symbol":"Np","atomic_mass":237,"category":"actinide","x":7,"y":10,"electron_configuration":"[Rn] 5f4 6d1 7s2"},
	{"name":"Plutonium","atomic_number":94,"symbol":"Pu","atomic_mass":244,"category":"actinide","x":8,"y":10,"electron_configuration":"[Rn] 5f6 7s2"},
	{"name":"Americium","atomic_number":95,"symbol":"Am","atomic_mass":243,"category":"actinide","x":9,"y":10,"electron_configuration":"[Rn] 5f7 7s2"},
	{"name":"Curium","atomic_number":96,"symbol":"Cm","atomic_mass":247,"category":"actinide","x":10,"y":10,"electron_configuration":"[Rn] 5f7 6d1 7s2"},
	{"name":"Berkelium","atomic_number":97,"symbol":"Bk","atomic_mass":247,"category":"actinide","x":11,"y":10,"electron_configuration":"[Rn] 5f9 7s2"},
	{"name":"Californium","atomic_number":98,"symbol":"Cf","atomic_mass":251,"category":"actinide","x":12,"y":10,"electron_configuration":"[Rn] 5f10 7s2"},
	{"name":"Einsteinium","atomic_number":99,"symbol":"Es","atomic_mass":252,"category":"actinide","x":13,"y":10,"electron_configuration":"[Rn] 5f11 7s2"},
	{"name":"Fermium","atomic_number":100,"symbol":"Fm","atomic_mass":257,"category":"actinide","x":14,"y":10,"electron_configuration":"[Rn] 5f12 7s2"},
	{"name":"Mendelevium","atomic_number":101,"symbol":"Md","atomic_mass":258,"category":"actinide","x":15,"y":10,"electron_configuration":"[Rn] 5f13 7s2"},
	{"name":"Nobelium","atomic_number":102,"symbol":"No","atomic_mass":259,"category":"actinide","x":16,"y":10,"electron_configuration":"[Rn] 5f14 7s2"},
	{"name":"Lawrencium","atomic_number":103,"symbol":"Lr","atomic_mass":266,"category":"actinide","x":17,"y":10,"electron_configuration":"[Rn] 5f14 7s2 7p1"},
	{"name":"Rutherfordium","atomic_number":104,"symbol":"Rf","atomic_mass":267,"category":"transition metal","x":4,"y":7,"electron_configuration":"[Rn] 5f14 6d2 7s2"},
	{"name":"Dubnium","atomic_number":105,"symbol":"Db","atomic_mass":268,"category":"transition metal","x":5,"y":7,"electron_configuration":"[Rn] 5f14 6d3 7s2"},
	{"name":"Seaborgium","atomic_number":106,"symbol":"Sg","atomic_mass":269,"category":"transition metal","x":6,"y":7,"electron_configuration":"[Rn] 5f14 6d4 7s2"},
	{"name":"Bohrium","atomic_number":107,"symbol":"Bh","atomic_mass":270,"category":"transition metal","x":7,"y":7,"electron_configuration":"[Rn] 5f14 6d5 7s2"},
	{"name":"Hassium","atomic_number":108,"symbol":"Hs","atomic_mass":269,"category":"transition metal","x":8,"y":7,"electron_configuration":"[Rn] 5f14 6d6 7s2"},
	{"name":"Meitnerium","atomic_number":109,"symbol":"Mt","atomic_mass":278,"category":"transition metal","x":9,"y":7,"electron_configuration":"[Rn] 5f14 6d7 7s2"},
	{"name":"Darmstadtium","atomic_number":110,"symbol":"Ds","atomic_mass":281,"category":"transition metal","x":10,"y":7,"electron_configuration":"[Rn] 5f14 6d8 7s2"},
	{"name":"Roentgenium","atomic_number":111,"symbol":"Rg","atomic_mass":282,"category":"transition metal","x":11,"y":7,"electron_configuration":"[Rn] 5f14 6d9 7s2"},
	{"name":"Copernicium","atomic_number":112,"symbol":"Cn","atomic_mass":285,"category":"post-transition metal","x":12,"y":7,"electron_configuration":"[Rn] 5f14 6d10 7s2"},
	{"name":"Nihonium","atomic_number":113,"symbol":"Nh","atomic_mass":286,"category":"post-transition metal","x":13,"y":7,"electron_configuration":"[Rn] 5f14 6d10 7s2 7p1"},
	{"name":"Flerovium","atomic_number":114,"symbol":"Fl","atomic_mass":289,"category":"post-transition metal","x":14,"y":7,"electron_configuration":"[Rn] 5f14 6d10 7s2 7p2"},
	{"name":"Moscovium","atomic_number":115,"symbol":"Mc","atomic_mass":290,"category":"post-transition metal","x":15,"y":7,"electron_configuration":"[Rn] 5f14 6d10 7s2 7p3"},
	{"name":"Livermorium","atomic_number":116,"symbol":"Lv","atomic_mass":293,"category":"post-transition metal","x":16,"y":7,"electron_configuration":"[Rn] 5f14 6d10 7s2 7p4"},
	{"name":"Tennessine","atomic_number":117,"symbol":"Ts","atomic_mass":294,"category":"metalloid","x":17,"y":7,"electron_configuration":"[Rn] 5f14 6d10 7s2 7p5"},
	{"name":"Oganesson","atomic_number":118,"symbol":"Og","atomic_mass":294,"category":"noble gas","x":18,"y":7,"electron_configuration":"[Rn] 5f14 6d10 7s2 7p6"}
];

const categoryColors: Record<string, { bg: string, border: string, text: string }> = {
    'diatomic nonmetal':    { bg: 'bg-green-500/50',    border: 'border-green-400',    text: 'text-green-300' },
    'noble gas':            { bg: 'bg-purple-500/50',   border: 'border-purple-400',   text: 'text-purple-300' },
    'alkali metal':         { bg: 'bg-red-500/50',      border: 'border-red-400',      text: 'text-red-300' },
    'alkaline earth metal': { bg: 'bg-orange-500/50',   border: 'border-orange-400',   text: 'text-orange-300' },
    'metalloid':            { bg: 'bg-cyan-500/50',     border: 'border-cyan-400',     text: 'text-cyan-300' },
    'polyatomic nonmetal':  { bg: 'bg-lime-500/50',     border: 'border-lime-400',     text: 'text-lime-300' },
    'post-transition metal':{ bg: 'bg-gray-500/50',     border: 'border-gray-400',     text: 'text-gray-300' },
    'transition metal':     { bg: 'bg-yellow-500/50',   border: 'border-yellow-400',   text: 'text-yellow-300' },
    'lanthanide':           { bg: 'bg-indigo-500/50',   border: 'border-indigo-400',   text: 'text-indigo-300' },
    'actinide':             { bg: 'bg-pink-500/50',     border: 'border-pink-400',     text: 'text-pink-300' },
    'default':              { bg: 'bg-gray-700/50',     border: 'border-gray-600',     text: 'text-gray-300'}
};

type Element = typeof elementData[0];

const ElementTile: React.FC<{ element: Element; onSelect: (el: Element) => void }> = ({ element, onSelect }) => {
    const colors = categoryColors[element.category] || categoryColors.default;
    return (
    <div
        onClick={() => onSelect(element)}
        style={{ gridColumn: element.x, gridRow: element.y }}
        className={`flex flex-col justify-between p-0.5 sm:p-1 md:p-1.5 border rounded-md cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 ${colors.bg} ${colors.border}`}
    >
        <div className="text-[0.6rem] sm:text-xs text-brand-text-secondary">{element.atomic_number}</div>
        <div className="text-sm sm:text-lg md:text-xl font-bold text-center text-white">{element.symbol}</div>
        <div className="text-[0.5rem] sm:text-[0.6rem] md:text-xs text-center truncate text-brand-text-primary">{element.name}</div>
    </div>
)};


const ElementDetail: React.FC<{ element: Element | null; onClose: () => void }> = ({ element, onClose }) => {
    if (!element) return null;

    const colors = categoryColors[element.category] || categoryColors.default;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in-up p-4" onClick={onClose}>
            <div className="bg-brand-surface border-2 border-brand-border rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-text-primary">{element.name} ({element.symbol})</h2>
                        <p className={`capitalize font-semibold ${colors.text}`}>{element.category}</p>
                    </div>
                     <div className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}>
                        <div className="text-sm text-brand-text-secondary">{element.atomic_number}</div>
                        <div className="text-4xl font-bold text-center text-white">{element.symbol}</div>
                    </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="font-semibold text-brand-text-secondary">Atomic Mass:</span> <span className="font-mono">{element.atomic_mass} u</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-brand-text-secondary">Electron Config:</span> <span className="font-mono break-all">{element.electron_configuration}</span></div>
                </div>
                <button onClick={onClose} className="w-full mt-6 bg-brand-primary text-black font-semibold py-2 rounded-lg hover:bg-brand-primary-hover transition-colors">Close</button>
            </div>
        </div>
    );
};


const PeriodicTable: React.FC = () => {
    const [selectedElement, setSelectedElement] = useState<Element | null>(null);
    return (
        <div className="w-full">
             <h2 className="text-2xl font-bold text-brand-text-primary mb-6">Interactive Periodic Table</h2>
             <div className="overflow-x-auto custom-scrollbar pb-4">
                <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-[repeat(10,minmax(0,1fr))] gap-1 sm:gap-1.5 min-w-[700px] md:min-w-full">
                    {elementData.map(el => (
                        <ElementTile key={el.atomic_number} element={el} onSelect={setSelectedElement} />
                    ))}
                </div>
             </div>
            <ElementDetail element={selectedElement} onClose={() => setSelectedElement(null)} />
        </div>
    )
};

export default PeriodicTable;