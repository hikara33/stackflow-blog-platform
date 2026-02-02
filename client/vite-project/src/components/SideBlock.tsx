import React, {type ReactNode} from 'react'
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface SideBlockProps {
    title: string;
    children: ReactNode;
}

export const SideBlock: React.FC<SideBlockProps> = ({title, children}) => {
    return(
        <Paper className='mb-5 p-4'>
            <Typography variant='h6' className='px-4 pb-0'>
                {title}
            </Typography>
            {children}
        </Paper>
    );
};